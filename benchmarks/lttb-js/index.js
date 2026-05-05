import pg from 'pg';
import { lttb } from 'lttb-js';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100000', 10);
const THRESHOLD = parseInt(process.env.THRESHOLD || '1000', 10);
const TOTAL_ROWS = parseInt(process.env.TOTAL_ROWS || '100000000', 10);
const DB_URL = process.env.DB_URL || 'postgres://benchmark:password@postgres:5432/benchmark';

const client = new pg.Client({ connectionString: DB_URL });

await run();

async function run() {

  await client.connect();
  
  try {

    console.log(`starting lttb-js benchmark.`);
    console.log(`batch size: ${BATCH_SIZE}, threshold: ${THRESHOLD}`);
    
    const fetchStart = performance.now();
    const data = await fetchAllData();
    const fetchEnd = performance.now();
    console.log(`finished fetching data in ${((fetchEnd - fetchStart) / 1000).toFixed(2)} seconds.`);

    console.log('processing data...');

    const start = performance.now();
    const result = await lttb(data, THRESHOLD);
    const end = performance.now();
    
    console.log(`finished processing in ${((end - start) / 1000).toFixed(2)} seconds.`);
    console.log('benchmark completed successfully.');
    
  } catch (err) {

    console.error('Error during benchmark execution:', err);

  } finally {

    await client.end();
    await new Promise((resolve) => setTimeout(resolve, 5000));    
    process.exit(0);  
  }
}

async function fetchAllData() {

  console.log('fetching all data...');
  
  const data = [];

  for (let offset = 0; offset < TOTAL_ROWS; offset += BATCH_SIZE) {

    console.log(`fetched: ${offset.toLocaleString()}`);
  
    const result = await client.query(
      'SELECT x, random() as y FROM generate_series($1::int, $2::int) as x', 
      [offset + 1, offset + BATCH_SIZE]
    );

    data.push(...result.rows);
  }

  return data;
}
