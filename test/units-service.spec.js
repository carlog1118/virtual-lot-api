const UnitsService = require('../src/units/units-service');
const knex = require('knex');
const { makeUnitsArray } = require('./units.fixtures');

describe(`Units service object`, function() {
  let db;
  let testUnits= makeUnitsArray();

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  });
  
  before(() => db('units').truncate());

  afterEach(() => db('units').truncate());

  after(() => db.destroy());
  
  context(`Given 'units' has data`, () => {
    beforeEach(() => {
      return db
        .into('units')
        .insert(testUnits)
    });  
    
    it(`getAllUnits() resolves all units from 'units' table`, () => {
      return UnitsService.getAllUnits(db)
        .then(actual => {
          expect(actual).to.eql(testUnits)
        });
    });
    
    it(`getById() resolves a unit by id from 'units' table`, () => {
      const secondId = 2;
      const secondTestUnit = testUnits[secondId - 1];
      return UnitsService.getById(db, secondId)
        .then(actual => {
          expect(actual).to.eql({
            id: secondId,
            year: secondTestUnit.year,
            make: secondTestUnit.make,
            model: secondTestUnit.model,
            trim: secondTestUnit.trim,
            vin: secondTestUnit.vin,
            mileage: secondTestUnit.mileage,
            color: secondTestUnit.color,
            price: secondTestUnit.price,
            cost: secondTestUnit.cost,
            status: secondTestUnit.status,
          });
        });
    });

    it(`deleteUnit() removes a unit by id from 'units' table`, () => {
      const unitId = 2
      return UnitsService.deleteUnit(db, unitId)
        .then(() => UnitsService.getAllUnits(db))
        .then(allUnits => {
          const expected = testUnits.filter(unit => unit.id !== unitId)
          expect(allUnits).to.eql(expected)
        });
    });

    it(`updateUnit() updates a unit from the 'units' table`, () => {
      const idOfUnitToUpdate = 2;
      const newUnitData = {
        year: 2018,
        make: "Toyota",
        model: "Higlander",
        trim: "XLE",
        vin: "123456789abcdefg124",
        mileage: 50000,
        color: "Green",
        price: 40000,
        cost: 35000,
        status: "Available"
      };
      return UnitsService.updateUnit(db, idOfUnitToUpdate, newUnitData)
      .then(() => UnitsService.getById(db, idOfUnitToUpdate))
        .then(unit => {
          expect(unit).to.eql({
            id: idOfUnitToUpdate,
            ...newUnitData,
          });
        });
    });
  });
  
  context(`Given 'units' has no data`, () => {
    it(`getAllUnits() resolves an empty array`, () => {
      return UnitsService.getAllUnits(db)
        .then(actual => {
          expect(actual).to.eql([])
        });
    });
    
    it(`insertUnit() inserts a new unit and resolves the new article with an 'id'`, () => {
      const newUnit = {
        year: 2017,
        make: "Toyota",
        model: "Avalon",
        trim: "XLE",
        vin: "123456789abcdefg124",
        mileage: 50000,
        color: "Blue",
        price: 20000,
        cost: 16000,
        status: "Available"
      };
      return UnitsService.insertUnit(db, newUnit)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            year: newUnit.year,
            make: newUnit.make,
            model: newUnit.model,
            trim: newUnit.trim,
            vin: newUnit.vin,
            mileage: newUnit.mileage,
            color: newUnit.color,
            price: newUnit.price,
            cost: newUnit.cost,
            status: newUnit.status,
          })
        })
    });
  });

});