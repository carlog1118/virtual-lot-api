const express = require('express');
const xss = require('xss');
const UnitsService = require('./units-service');

const unitsRouter = express.Router();
const jsonParser = express.json();

unitsRouter
  .route('/')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      UnitsService.getAllUnits(knexInstance)
      .then(units => {
          res.json(units)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
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

    if (!year) {
      return res.status(400).json({
        error: { message: `Missing 'year' in request body`}
      })
    }

    if (!make) {
      return res.status(400).json({
        error: { message: `Missing 'make' in request body`}
      })
    }

    if (!model) {
      return res.status(400).json({
        error: { message: `Missing 'model' in request body`}
      })
    }

    if (!trim) {
      return res.status(400).json({
        error: { message: `Missing 'trim' in request body`}
      })
    }

    if (!vin) {
      return res.status(400).json({
        error: { message: `Missing 'vin' in request body`}
      })
    }

    if (!mileage) {
      return res.status(400).json({
        error: { message: `Missing 'mileage' in request body`}
      })
    }

    if (!color) {
      return res.status(400).json({
        error: { message: `Missing 'color' in request body`}
      })
    }

    if (!price) {
      return res.status(400).json({
        error: { message: `Missing 'price' in request body`}
      })
    }

    if (!cost) {
      return res.status(400).json({
        error: { message: `Missing 'cost' in request body`}
      })
    }

    if (!status) {
      return res.status(400).json({
        error: { message: `Missing 'status' in request body`}
      })
    }

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
  });

unitsRouter
  .route('/:unit_id')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      UnitsService.getById(knexInstance, req.params.unit_id)
        .then(unit => {
            if (!unit) {
              return res.status(404).json({
                  error: { message: `Unit doesn't exist`}
              })
            }
            res.json({
              id: unit.id,
              year: unit.year,
              make: xss(unit.make),
              model: xss(unit.model),
              trim: xss(unit.trim),
              vin: xss(unit.vin),
              mileage: unit.mileage,
              color: xss(unit.color),
              price: unit.price,
              cost: unit.cost,
              status: xss(unit.status)    
            })
        })
        .catch(next)
  });

module.exports = unitsRouter;

