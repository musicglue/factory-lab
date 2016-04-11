export const times = (n, fn) => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn());
  }
  return arr;
};

export const pickRandom = array =>
  array[Math.floor(array.length * Math.random())];

export const flatten = array =>
  array.reduce((result, entry) =>
    result.concat(Array.isArray(entry) ? entry : [entry]), []);

export const cartesianProduct = (...args) =>
  args.reduce((results, arg) =>
    flatten(results.map(result =>
      arg.map(val => result.concat([val])))),
    [[]]);

export const first =
  array => array[0];

export const rest = array =>
  array.slice(1);

const assignDeep = (obj = {}, val, ...path) => ({
  ...obj,
  [path[0]]: path.length === 1
    ? val
    : assignDeep(obj[path[0]], val, rest(path)),
});

export const splitAttrs = attrs =>
  Object.keys(attrs).reduce(([subAttrs, overrides], attr) =>
    (attr.indexOf('.') === -1
      ? [subAttrs, { ...overrides, [attr]: attrs[attr] }]
      : [assignDeep(subAttrs, ...attr.split('.')), overrides]), [{}, {}]);
