const { expect } = require('chai');
const knex = require('knex');
const app = require ('../src/app');
const jwt = require('jsonwebtoken');
const { makeUsersArray } = require('./users.fixtures');
const { makeUnitsArray } = require('./units.fixtures');

describe('Units Endpoints', function() {
  let db

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
    
  before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the units table', () => db('units').truncate());

  before('clean the users table', () => db('users').truncate());
  
  afterEach('cleanup units', () => db('units').truncate());

  afterEach('cleanup users', () => db('users').truncate());
  
  describe(`Protected endpoints`, () => {
    const testUnits = makeUnitsArray();
    beforeEach('insert units', () => {
      return db
        .into('units')
        .insert(testUnits)
    });

    describe(`GET /api/units/:unit_id`, () => {
      it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
         return supertest(app)
          .get(`/api/units/123`)
          .expect(401, { error: `Missing bearer token` })
      })
    })
  });

  describe(`GET /api/units`, () => {
    testUsers = makeUsersArray();
      
    beforeEach('insert units', () => {
      return db
        .into('users')
       .insert(testUsers)
    });

    context(`Given no units`, () => {
          
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/units')
          .set('Authorization', makeAuthHeader(testUsers[0]))
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
          .get('/api/units')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, testUnits)
      });
    });
  });

  describe(`GET /api/units/:unit_id`, () => {
    testUsers = makeUsersArray();
      
    beforeEach('insert units', () => {
      return db
        .into('users')
       .insert(testUsers)
    });

    context(`Given no units`, () => {
      it(`responds with 404`, () => {
        const unitId = 123456
        return supertest(app)
          .get(`/api/units/${unitId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Unit doesnt exist` } })
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
          .get(`/api/units/${unitId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedUnit)
      });
    });

    context(`Given an XSS attack unit`, () => {
      const maliciousUnit = {
        id: 911,
        year: 2018,
        make: 'Naughty naughty very naughty <script>alert("xss");</script>',
        model: 'Higlander',
        trim: 'XLE',
        vin: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        mileage: 50000,
        color: 'Green',
        price: 40000,
        cost: 35000,
        status: 'Available'
      }
      
      beforeEach('insert malicious unit', () => {
        return db
          .into('units')
          .insert([ maliciousUnit ])
      })
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/units/${maliciousUnit.id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body.make).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
            expect(res.body.vin).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
          })
      })
    })
  });

  describe(`POST /api/units`, () => {
    testUsers = makeUsersArray();
      
    beforeEach('insert units', () => {
      return db
        .into('users')
       .insert(testUsers)
    });
    
    it(`creates a unit, responding with 201 and the new unit`, () => {
      const newUnit = {
        year: 2018,
        make: 'Toyota',
        model: 'Higlander',
        trim: 'XLE',
        vin: '123456789abcdefg124',
        mileage: 50000,
        color: 'Green',
        price: 40000,
        cost: 35000,
        status: 'Available'
      };  
      return supertest(app)
        .post('/api/units')
        .set('Authorization', makeAuthHeader(testUsers[0]))
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
          expect(res.headers.location).to.eql(`/api/units/${res.body.id}`)          
        })
        .then(res =>
          supertest(app)
            .get(`/api/units/${res.body.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res.body)
        )    
    });

    const requiredFields = [
      'year',
      'make',
      'model',
      'trim',
      'vin',
      'mileage',
      'color',
      'price',
      'cost',
      'status'
    ];

    requiredFields.forEach(field => {
      const newUnit = {
        year: '2018',
        make: "Toyota",
        model: "Higlander",
        trim: "XLE",
        vin: "123456789abcdefg124",
        mileage: '50000',
        color: "Green",
        price: '40000',
        cost: '35000',
        status: "Available"
      }
    
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUnit[field]
    
        return supertest(app)
          .post('/api/units')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newUnit)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
            })
          })
      })
  });
  
  describe(`Delete /api/units/:unit_id`, () =>{
    const testUsers = makeUsersArray();
    
    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    });

    context('Given there are units in the database', () => {
      const testUnits = makeUnitsArray();

      beforeEach('insert units', () => {
        return db
          .into('units')
          .insert(testUnits)
       });
      
      it('responds with 204 and removes the unit', () => {
        const idToRemove = 1;
        const expectedUnit = testUnits.filter(unit => unit.id !== idToRemove)
        return supertest(app)
          .delete(`/api/units/${idToRemove}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/units`)
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(expectedUnit)
          )
        });
    });
    
    context(`Given no units`, () => {
      it(`responds with 404`, () => {
        const unitId = 123456;
        return supertest(app)
          .delete(`/api/units/${unitId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Unit doesnt exist` } })
      });
    });
  });

  describe(`Patch /api/units/:unit_id`, () => {
    const testUsers= makeUsersArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    });
    
    context(`Given no articles`, () => {
      it(`responds with 404`, () => {
        const unitId = 123456
        return supertest(app)
          .patch(`/api/units/${unitId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Unit doesnt exist` }})
      });
    });

    context('Given there are units in the database', () => {
      const testUnits= makeUnitsArray();

      beforeEach('insert units', () => {
        return db
          .into('units')
          .insert(testUnits)
      });
      
      it('responds with 204 and updates the unit', () => {
        const idToUpdate = 2
        const updateUnit = {
          year: 2010,
          make: 'Hummer',
          model: 'H3',
          trim: 'H3',
          vin: '123456789abc987',
          mileage: 100000,
          color: 'Yellow',
          price: 10000,
          cost: 5000,
          status: 'Sold'
        }
        const expectedUnit = {
          ...testUnits[idToUpdate - 1],
          ...updateUnit
        }
        return supertest(app)
          .patch(`/api/units/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(updateUnit)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/units/${idToUpdate}`)
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(expectedUnit)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/units/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `request body must contain at least one of the fields.`
            }
          })
      });

      it(`responds with 204 awhen updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUnit = {
          year: 1999.
        }
        const expectedUnit = {
          ...testUnits[idToUpdate-1],
          ...updateUnit
        }

        return supertest(app)
          .patch(`/api/units/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({
            ...updateUnit,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/units/${idToUpdate}`)
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(expectedUnit)
          )
      });
    });
  });
});