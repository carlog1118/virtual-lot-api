const express = require('express');
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
                  error: { message: `Unit doesn't exist `}
              })
            }
            res.json(unit)
        })
        .catch(next)
  });

module.exports = unitsRouter;

