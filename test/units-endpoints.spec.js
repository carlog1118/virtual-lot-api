const { expect } = require('chai');
const knex = require('knex');
const app = require ('../src/app');
const { makeUnitsArray } = require('./units.fixtures');

describe('Units Endpoints', function() {
  let db
    
  before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('units').truncate());
  
  afterEach('cleanup', () => db('units').truncate());
  
  describe(`GET /units`, () => {
    context(`Given no units`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/units')
          .expect(200, [])
      });
    });

    context('Given there are units in the database', () => {
      const testUnits = makeUnitsArray();

      beforeEach('insert units', () => {
        return db
          .into('units')
          .insert(testUnits)
      });

      it('responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/units')
          .expect(200, testUnits)
      });
    });
  });

  describe(`GET /units/:unit_id`, () => {
    context(`Given no units`, () => {
      it(`responds with 404`, () => {
        const unitId = 123456
        return supertest(app)
          .get(`/units/${unitId}`)
          .expect(404, { error: { message: `Unit doesn't exist` } })
      });
    });

    context('Given there are units in the database', () => {
      const testUnits = makeUnitsArray();

      beforeEach('insert units', () => {
        return db
          .into('units')
          .insert(testUnits)
      });

      it('responds with 200 and the specified unit', () => {
        const unitId = 2
        const expectedUnit = testUnits[unitId - 1]
        return supertest(app)
          .get(`/units/${unitId}`)
          .expect(200, expectedUnit)
      });
    });
  });

  describe.only(`POST /units`, () => {
    it(`creates a unit, responding with 201 and the new unit`, () => {
      const newUnit = {
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
      return supertest(app)
        .post('/units')
        .send(newUnit)
        .expect(201)
        .expect(res => {
          expect(res.body.year).to.eql(newUnit.year)
          expect(res.body.make).to.eql(newUnit.make)
          expect(res.body.model).to.eql(newUnit.model)
          expect(res.body.trim).to.eql(newUnit.trim)
          expect(res.body.vin).to.eql(newUnit.vin)
          expect(res.body.mileage).to.eql(newUnit.mileage)
          expect(res.body.color).to.eql(newUnit.color)
          expect(res.body.price).to.eql(newUnit.price)
          expect(res.body.cost).to.eql(newUnit.cost)
          expect(res.body.status).to.eql(newUnit.status)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/units/${res.body.id}`)          
        })
        .then(res =>
          supertest(app)
            .get(`/units/${res.body.id}`)
            .expect(res.body)
        )    
    });
  });
});