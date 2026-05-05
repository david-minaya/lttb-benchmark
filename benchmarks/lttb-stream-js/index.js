import pg from 'pg';
import QueryStream from 'pg-query-stream';
import { lttbStream } from 'lttb-js';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);
const THRESHOLD = parseInt(process.env.THRESHOLD);
const TOTAL_ROWS = parseInt(process.env.TOTAL_ROWS);
const DB_URL = process.env.DB_URL;

const client = new pg.Client({ connectionString: DB_URL });

await run();

async function run() {

  await client.connect();
  
  try {

    console.log(`starting lttb-stream-js benchmark.`);
    console.log(`batch size: ${BATCH_SIZE}, threshold: ${THRESHOLD}`);
        
    console.log('processing data in stream mode...');

    const start = performance.now();

    const result = await lttbStream(
      TOTAL_ROWS,
      THRESHOLD,
      BATCH_SIZE,
      async function* (offset, size) {
  
        console.log(`fetched: ${offset.toLocaleString()}`);

        const query = new QueryStream(
          'SELECT x, random() as y FROM generate_series($1::int, $2::int) as x',
          [offset + 1, offset + Math.ceil(size)],
          { highWaterMark: 1000 }
        );

        const stream = client.query(query);

        // const result = await client.query(
        //   'SELECT x, random() as y FROM generate_series($1::int, $2::int) as x',
        //   [offset + 1, offset + Math.ceil(size)]
        // );

        for await (const row of stream) {
          yield { x: row.x, y: row.y };
        }
      }
    );

    const end = performance.now();
    
    console.log(`finished processing in ${((end - start) / 1000).toFixed(2)} seconds.`);
    console.log(`benchmark completed successfully. output points: ${result.length}`);
    
  } catch (err) {

    console.error('Error during benchmark execution:', err);

  } finally {

    await client.end();
    await new Promise((resolve) => setTimeout(resolve, 5000));    
    process.exit(0);  
  }
}
