const app = require('./app');
 const knex= require('knex');
const { PORT, DB_URL } = require('./config');
const UnitsService = require('./units-service');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

console.log(UnitsService.getAllUnits())

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});