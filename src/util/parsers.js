export function parseProduce(input: any): boolean {
  const requirements = [
    { key: 'name', type: 'string' },
    { key: 'quantity', type: 'number' },
    { key: 'price', type: 'number' }
  ];
  return requirements.every((req) => {
    return input.hasOwnProperty(req.key) && typeof input[req.key] === req.type;
  });
}

export function parseUpdate(input: any): any | null {
  const validKeys = ['name', 'quantity', 'price'];
  const trimmed = Object.keys(input).reduce((obj, curr) => {
    if (obj && validKeys.indexOf(curr) !== -1) {
      obj[curr] = input[curr];
      return obj;
    }
  }, {});
  return (trimmed && Object.keys(trimmed).length > 0) ? trimmed : null;
}

export function parseId(input: any): number | boolean {
  if (input.hasOwnProperty('id'))
    return (typeof input.id === 'string') ? parseInt(input.id, 10) : input.id;
  return false;
}
