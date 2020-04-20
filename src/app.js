require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const unitssRouter = require('./units/units-router');
const winston = require('winston');
const { CLIENT_ORIGIN } = require('./config'); 

const app = express();


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/units', unitssRouter);

app.get('/', (req, res) => {
    res.json({ok: true});
});



/*app.get('/units', (req, res, next) => {
  const knexInstance = req.app.get('db');
  UnitsService.getAllUnits(knexInstance)
    .then(units => {
      res.json(units)
    })
    .catch(next)
});

app.get('/units/:unit_id', (req,res, next) => {
  const knexInstance = req.app.get('db');
  UnitsService.getById(knexInstance, req.params.unit_id)
    .then(unit => {
      if (!unit) {
        return res.status(404).json({
          error: { message: `Unit doesn't exist` }
        })
      }
      res.json(unit)
    })
    .catch(next)
});

app.post('/units', jsonParser, (req, res, next) => {
  const { 
    year,
    make,
    model,
    trim,
    vin,
    mileage,
    color,
    price,
    cost,
    status
  } = req.body;
  const newUnit = {
    year,
    make,
    model,
    trim,
    vin,
    mileage,
    color,
    price,
    cost,
    status
  };
  UnitsService.insertUnit(
    req.app.get('db'),
    newUnit
  )
    .then(unit => {
      res
        .status(201)
        .location(`/units/${unit.id}`)
        .json(unit)
    })
    .catch(next)
});*/

app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
})

module.exports = app;