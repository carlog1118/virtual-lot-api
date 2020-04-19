const UnitsService = {
  getAllUnits(knex) {
    return knex.select('*').from('units')
  },
  insertUnit(knex, newUnit){
    return knex
      .insert(newUnit)
      .into('units')
      .returning('*')
      .then(rows => {
          return rows[0]
      });
  },
  getById(knex, id) {
      return knex.from('units').select('*').where('id', id).first()
  },
  deleteUnit(knex, id) {
      return knex('units')
        .where({ id })
        .delete()
  },
  updateUnit(knex, id, newUnitFields) {
      return knex('units')
        .where({ id })
        .update(newUnitFields)
  },
};

module.exports = UnitsService