// const { Pool } = require('pg');

// const connectionString = process.env.NEON_CONN;

// const pool = new Pool({
//   connectionString: connectionString,
//   idleTimeoutMillis: 30000, // 30 seconds idle timeout
//   connectionTimeoutMillis: 0, // 2 seconds to establish a connection
// });

// async function connectToDatabase() {
//   try {
//     const client = await pool.connect();
//     console.log('Connected to the database');

//     client.on('error', async (err) => {
//       console.error('Unexpected error on idle client', err);
//       client.release();
//       setTimeout(connectToDatabase, 5000); // Reconnect
//     });

//     client.on('end', () => {
//       console.log('Database connection closed');
//       setTimeout(connectToDatabase, 5000); // Reconnect
//     });

//     // Perform any setup or initial queries here

//     return client;
//   } catch (err) {
//     console.error('Connection error', err.stack);
//     setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
//   }
// }

// // Initial connection
// connectToDatabase();

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
  getClient: () => prisma,
};
