require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DB_URL || 'postgresql://virtual_lot@localhost/virtual-lot',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://virtual_lot@localhost/virtual-lot-test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}