import instrumentation
import os
import time
import psycopg2
import lttb
import numpy as np

BATCH_SIZE = int(os.environ.get('BATCH_SIZE', '100000'))
THRESHOLD = int(os.environ.get('THRESHOLD', '1000'))
TOTAL_ROWS = int(os.environ.get('TOTAL_ROWS', '100000000'))
DB_URL = os.environ.get('DB_URL', 'postgresql://benchmark:password@postgres:5432/benchmark')

conn = None

def run() -> None:

    global conn
    conn = psycopg2.connect(DB_URL)

    try:

        print("starting lttb-py benchmark.")
        print(f"batch size: {BATCH_SIZE}, threshold: {THRESHOLD}")

        fetch_start = time.perf_counter()
        data = fetch_all_data()
        fetch_end = time.perf_counter()
        print(f"finished fetching data in {fetch_end - fetch_start:.2f} seconds.")
        
        print("processing data...")
        start_time = time.perf_counter()
        result = lttb.downsample(data, n_out=THRESHOLD)
        end_time = time.perf_counter()
        print(f"finished processing in {end_time - start_time:.2f} seconds.")
        
        print("benchmark completed successfully.")

    except Exception as e:

        print(f"error during benchmark execution: {e}")

    finally:

        if conn is not None:
            conn.close()
        time.sleep(5)

def fetch_all_data() -> np.ndarray:

    print("fetching all data...")
    
    all_data = []

    with conn.cursor() as cur:
        for offset in range(0, TOTAL_ROWS, BATCH_SIZE):
            
            print(f"fetched: {offset:,}")
        
            cur.execute(
                "SELECT x, random() as y FROM generate_series(%s::int, %s::int) as x", 
                (offset + 1, offset + BATCH_SIZE)
            )
            
            rows = cur.fetchall()
            
            for row in rows:
                all_data.append([row[0], row[1]])
                
    return np.array(all_data)

if __name__ == "__main__":
    run()
