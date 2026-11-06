
const { Pool } = require("pg");

const communityPool = new Pool({
    host: process.env.COMMUNITY_DB_HOST,
    port: Number(process.env.COMMUNITY_DB_PORT || 5432),
    database: process.env.COMMUNITY_DB_NAME,
    user: process.env.COMMUNITY_DB_USER,
    password: process.env.COMMUNITY_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

communityPool.on("error", (error) => {
    console.error(
        "Error inesperado en PostgreSQL de comunidad:",
        error.message
    );
});

module.exports = communityPool;
