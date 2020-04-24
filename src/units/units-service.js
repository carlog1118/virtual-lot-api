const UnitsService = {
  getAllUnits(knex, make, model) {
    console.log(make)
    console.log(model)

    if (make && !model) {
      return knex.from('units').select('*').where('make', 'ILIKE', `%${make}%`)
    } else if(model && !make) {
      return knex.from('units').select('*').where('model', 'ILIKE', `%${model}%`)
    } else if(make || model){
      return knex.from('units').select('*').where('make', 'ILIKE', `%${make}%`).orWhere('model', 'ILIKE', `%${model}%`)
    } else {
      return knex.from('units').select('*')
    }
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