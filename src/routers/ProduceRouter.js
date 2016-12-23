// @ flow

import inventory from '../../data/produce';
import { Router }  from 'express';
import saveInventory, {genId} from '../util/save';
import { parseProduce, parseUpdate, parseId } from '../util/parsers';

export default class ProduceRouter {
  // these fields must be type annotated, or Flow will complain!
  router: Router;
  path: string;

  // take the mount path as the constructor argument
  constructor(path = '/api/v1/produce') {
    // instantiate the express.Router
    this.router = Router();
    this.path = path;
    // glue it all together
    this.init();
  }

  /**
   * Return all items in the inventory
   */
  getAll(req: $Request, res: $Response): void {
    res.status(200).json(inventory);
  }

  /**
   * Return an item from the inventory by ID.
   */
  getById(req: $Request, res: $Response): void {
    const id = parseInt(req.params.id, 10);
    const record = inventory.find(item => item.id === id);
    if (record) {
      res.status(200).json({
        message: 'Success!',
        item: record
      });
    } else {
      res.status(400).json({
        status: res.status,
        message: `No item found with id: ${id}`
      });
    }
  }

  /**
   * Add a new item to the inventory.
   */
  postOne(req: $Request, res: $Response): void {
    const received: Produce | boolean = parseProduce(req.body);
    const newProduce = (received) ? req.body : null;
    if (received) {
      newProduce.id = genId(received, inventory);
      inventory.push(newProduce);
      res.status(200).json({
        status: 200,
        message: 'Success!',
        item: newProduce
      });
      // write updated inventory to the file
      saveInventory(inventory)
      .then((writePath) => {
        logger(`Inventory updated. Written to:\n\t${path.relative(path.join(__dirname, '..', '..'), writePath)}`);
      })
      .catch((err) => {
        logger('Error writing to inventory file.');
        logger(err.stack);
      });
    } else {
      res.status(400).json({
        status: 400,
        message: 'Bad Request. Make sure that you submit an item with a name, quantity, and price.'
      });
      logger('Malformed POST to /produce.');
    }
  }

  /**
   * Update a Produce item by id.
   */
  updateOneById(req: $Request, res: $Response): void {
    const searchId: number | boolean = parseId(req.params);
    const payload: any = parseUpdate(req.body);
    let toUpdate: Produce = inventory.find(item => item.id === searchId);
    if (toUpdate && payload) {
      Object.keys(payload).forEach((key) => {
        if (key === 'quantity' || key === 'price') toUpdate[key] = Number(payload[key]);
        else toUpdate[key] = payload[key];
      });
      res.json({
        status: res.status,
        message: 'Success!',
        item: toUpdate
      });
      saveInventory(inventory)
      .then((writePath) => {
        logger(`Item updated. Inventory written to:\n\t${path.relative(path.join(__dirname, '..', '..'), writePath)}`);
      })
      .catch((err) => {
        logger('Error writing to inventory file.');
        logger(err.stack);
      });
    } else {
      res.status(400).json({
        status: res.status,
        message: 'Update failed. Make sure the item ID and submitted fields are correct.'
      });
    }
  }

  /**
   * Remove an item from the inventory by ID.
   */
  removeById(req: $Request, res: $Response): void {
    const searchId: number | boolean = parseId(req.params);
    let toDel: number = inventory.findIndex(item => item.id === searchId);
    if (toDel !== -1) {
      let deleted = inventory.splice(toDel, 1)[0];
      res.json({
        status: 200,
        message: 'Success!',
        deleted
      });
      // update json file
      saveInventory(inventory)
      .then((writePath) => {
        logger(`Item deleted. Inventory written to:\n\t${writePath}`);
      })
      .catch((err) => {
        logger('Error writing to inventory file.');
        logger(err.stack);
      });
    } else {
      res.status(400).json({
        status: 400,
        message: 'No item found with given ID.'
      });
    }
  }

  /**
   * Attach route handlers to their endpoints.
   */
  init(): void {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getById);
    this.router.post('/', this.postOne);
    this.router.put('/:id', this.updateOneById);
    this.router.delete('/:id', this.removeById);
  }

}
