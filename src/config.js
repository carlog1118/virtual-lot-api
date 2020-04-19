module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://virtual_lot@localhost/virtual-lot',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*'
}