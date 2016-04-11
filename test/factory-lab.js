import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import faker from 'faker';

import FactoryLab from '../src';

chai.use(dirtyChai);

describe('FactoryLab', () => {
  context('with a simple factory', () => {
    const GoatFactory = new FactoryLab()
      .attr('name', faker.name.firstName)
      .attr('hasHorns', faker.random.boolean);

    describe('.build', () => {
      it('returns an object with the correct fields', () => {
        const goat = GoatFactory.build();
        expect(goat).to.have.property('name').to.be.a('string');
        expect(goat).to.have.property('hasHorns').to.be.a('boolean');
      });

      it('allows overriding attrs', () => {
        const goat = GoatFactory.build({ name: 'Apathy', adorable: false });
        expect(goat).to.have.property('name', 'Apathy');
        expect(goat).to.have.property('hasHorns').to.be.a('boolean');
        expect(goat).to.have.property('adorable', false);
      });
    });

    describe('.buildList', () => {
      it('builds arrays of the correct length', () => {
        const goats = GoatFactory.buildList(10);
        expect(goats).to.have.length(10);
      });

      it('allows over-riding attrs', () => {
        const goats = GoatFactory.buildList(10, { farmerId: 'abc123' });
        goats.forEach(goat => expect(goat).to.have.property('farmerId', 'abc123'));
      });
    });
  });

  context('with a factory with variations', () => {
    const GoatFactory = new FactoryLab()
      .optional('name', faker.name.lastName)
      .attr('hasHorns', true, false);

    describe('.buildAll', () => {
      it('builds all variations', () => {
        const goats = GoatFactory.buildAll();
        expect(goats).to.have.length(4);
        expect(goats[0]).to.have.property('name');
        expect(goats[1]).to.have.property('name');
        expect(goats[2]).not.to.have.property('name');
        expect(goats[3]).not.to.have.property('name');
        expect(goats[0]).to.have.property('hasHorns', true);
        expect(goats[1]).to.have.property('hasHorns', false);
        expect(goats[2]).to.have.property('hasHorns', true);
        expect(goats[3]).to.have.property('hasHorns', false);
      });

      it('allows overriding attrs', () => {
        const goats = GoatFactory.buildAll({ farmerId: 'abc123' });
        goats.forEach(goat => expect(goat).to.have.property('farmerId', 'abc123'));
      });
    });

    describe('.buildDefault', () => {
      it('Uses the first value from each attr definition', () => {
        const goat = GoatFactory.buildDefault();
        expect(goat).to.have.property('name').to.be.a('string');
        expect(goat).to.have.property('hasHorns', true);
      });
    });

    describe('.buildDefaultList', () => {
      it('builds the correct number of objects', () =>
        expect(GoatFactory.buildDefaultList(13)).to.have.length(13));
    });
  });

  context('with nested factories', () => {
    const HornFactory = new FactoryLab()
      .attr('length', faker.random.number, null)
      .attr('shape', 'curly', 'pointy');

    const GoatFactory = new FactoryLab()
      .optional('name', faker.name.lastName)
      .attr('horns', HornFactory);

    describe('.build', () => {
      it('builds nested factories', () => {
        const goat = GoatFactory.build();
        expect(goat).to.have.property('horns');
        expect(goat.horns).to.have.property('length');
        expect(goat.horns).to.have.property('shape');
      });
    });

    describe('.buildAll', () => {
      it('includes all variations from nested factories', () => {
        const goats = GoatFactory.buildAll();
        expect(goats).to.have.length(8);
        goats.slice(0, 4).forEach(goat =>
          expect(goat).to.have.property('name').to.be.a('string'));
        goats.slice(4, 8).forEach(goat =>
          expect(goat).not.to.have.property('name'));
        [0, 1, 4, 5].forEach(i =>
          expect(goats[i].horns).to.have.property('length').to.be.a('number'));
        [2, 3, 6, 7].forEach(i =>
          expect(goats[i].horns).to.have.property('length', null));
        [0, 2, 4, 6].forEach(i =>
          expect(goats[i].horns).to.have.property('shape', 'curly'));
        [1, 3, 5, 7].forEach(i =>
          expect(goats[i].horns).to.have.property('shape', 'pointy'));
      });
    });

    describe('.buildDefault', () => {
      it('includes nested defaults', () => {
        const goat = GoatFactory.buildDefault();
        expect(goat).to.have.property('name').to.be.a('string');
        expect(goat).to.have.property('horns').to.be.an('object');
        expect(goat.horns).to.have.property('length').to.be.a('number');
        expect(goat.horns).to.have.property('shape', 'curly');
      });
    });
  });
});
