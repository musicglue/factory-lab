# Factory Lab

An R & D department for your factories. Build JS objects in all their possible variations for use in
unit tests. Inspired by [Rosie](https://github.com/rosiejs/rosie).

# Usage

You can define a factory similarly to Rosie like so:

```js
import FactoryLab from 'factory-lab';

const GoatFactory = new FactoryLab()
  .attr('name', generateGoatName)
  .attr('hasHorns', randomBool);

GoatFactory.build();
// { name: 'Cynthia', hasHorns: false }

GoatFactory.buildList(3);
// [
//   { name: 'George', hasHorns: true },
//   { name: 'Asparagu', hasHorns: true },
//   { name: 'Nettles', hasHorns: false },
// ]
```

But some goats don't have names, and you want to make sure that your code works regardless of
a whether goats have horns or not. By supplying more than one function/value for an attribute you
can set up multiple variations of that attribute. You can also mark attributes as optional:

```js
const GoatFactory = new FactoryLab()
  .optional('name', generateGoatName)
  .attr('hasHorns', true, false);

// As `name` is optional, sometimes it won't be present in the objects returned by `.build()`:
GoatFactory.build();
// { hasHorns: false }
```

Now, you can use `.buildAll()` to get all the possible variations of goat:

```js
GoatFactory.buildAll();
// [
//   { name: 'Wine', hasHorns: true },
//   { name: 'Apathy', hasHorns: false },
//   { hasHorns: true },
//   { hasHorns: false },
// ]
```

Often, you might want a 'full' goat with all properties present or at their default values.
`.buildFull()` will make all optional values present, and set all attributes to the value/function
given first in the `.attr` definition:

```js
GoatFactory.buildDefault();
// { name: 'Hoof Face', hasHorns: true } // name will always be present, hasHorns always true.
```

All of the `buildX` functions have `buildXList` equivalents.

WOOP 🐐
