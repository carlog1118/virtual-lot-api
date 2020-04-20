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
  .all((req, res, next) => {
    UnitsService.getById(
      req.app.get('db'),
      req.params.unit_id
    )
      .then(unit => {
        if (!unit) {
            return res.status(404).json({
                error: { message: `Unit doesnt exist` }
            })
        }
        res.unit = unit
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
          id: res.unit.id,
          year: res.unit.year,
          make: xss(res.unit.make),
          model: xss(res.unit.model),
          trim: xss(res.unit.trim),
          vin: xss(res.unit.vin),
          mileage: res.unit.mileage,
          color: xss(res.unit.color),
          price: res.unit.price,
          cost: res.unit.cost,
           status: xss(res.unit.status)    
        })
  })
  .delete((req, res, next) => {
    UnitsService.deleteUnit(
      req.app.get('db'),
      req.params.unit_id
    )
      .then(() => {
          res.status(204).end()
      })
      .catch(next)
  })

module.exports = unitsRouter;

