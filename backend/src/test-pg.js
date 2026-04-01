import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: process.argv[2] || process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}

run();
