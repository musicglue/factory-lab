import {
  cartesianProduct,
  first,
  flatten,
  pickRandom,
  times,
} from './utils';

const setValue = (obj, { value, key }) => {
  if (key === null) return obj;
  let resolvedValue;

  if (value instanceof FactoryLab) {
    resolvedValue = value.build();
  } else if (typeof value === 'function') {
    resolvedValue = value();
  } else {
    resolvedValue = value;
  }

  return {
    ...obj,
    [key]: resolvedValue,
  };
};


export default class FactoryLab {
  constructor(initialAttributes = []) {
    this.attributes = initialAttributes;
  }

  attr(name, ...values) {
    return new FactoryLab([
      ...this.attributes,
      values.map(value => ({ value, key: name })),
    ]);
  }

  optional(name, ...values) {
    return new FactoryLab([
      ...this.attributes,
      values.map(value => ({ value, key: name })).concat([{ key: null }]),
    ]);
  }

  variations() {
    return cartesianProduct(...this.attributes.map(values =>
      flatten(values.map(({ value, key }) =>
        (value instanceof FactoryLab
          ? value.variations().map(variation => ({ value: variation, key }))
          : { value, key })))));
  }

  build(overrideAttrs = {}) {
    return {
      ...this.attributes.reduce((built, values) => setValue(built, pickRandom(values)), {}),
      ...overrideAttrs,
    };
  }

  buildList(count, overrideAttrs = {}) {
    return times(count, () => this.build(overrideAttrs));
  }

  buildAll(overrideAttrs = {}) {
    const expanded = this.attributes.map(values =>
      flatten(values.map(({ key, value }) =>
        (value instanceof FactoryLab
          ? value.buildAll().map(built => ({ key, value: built }))
          : { key, value }))));

    return cartesianProduct(...expanded).map(attrs => ({
      ...attrs.reduce(setValue, {}),
      ...overrideAttrs,
    }));
  }

  buildDefault(overrideAttrs = {}) {
    const expanded = this.attributes.map(values =>
      values.map(({ key, value }) => ({
        key,
        value: value instanceof FactoryLab
          ? value.buildDefault()
          : value,
      })));

    return {
      ...expanded.map(first).reduce(setValue, {}),
      ...overrideAttrs,
    };
  }

  buildDefaultList(count, overrideAttrs = {}) {
    return times(count, () => this.buildDefault(overrideAttrs));
  }
}
