import fs from 'fs';
import pg from 'pg';

const { Client } = pg;

async function runSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to Neon via pg driver.');

    const sql = fs.readFileSync('./schema.sql', 'utf-8');
    await client.query(sql);
    console.log('Schema deployed successfully!');

  } catch (error) {
    console.error('Error deploying schema:', error);
  } finally {
    await client.end();
  }
}

runSchema();
