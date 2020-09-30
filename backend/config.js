require("dotenv").config({ path: __dirname + '/.env' });

const config = {
    port: process.env.PORT
}

module.exports = config;