# LTTB Benchmark 📈

A comprehensive benchmarking suite designed to compare the performance, memory footprint, and execution characteristics of various implementations of the **LTTB (Largest Triangle Three Buckets)** downsampling algorithm.

## 🚀 Overview

Each LTTB implementation is run in its own isolated Docker container. All containers share the same environment variables and hardware constraints (like memory limits) to guarantee **fair testing conditions**.

To generate and serve the huge amounts of data processed during the tests, we use **PostgreSQL**. Metrics are collected and can be viewed in real-time.

## 📦 Tested libraries

- [`lttb-js`](https://www.npmjs.com/package/lttb-js)
- [`downsample`](https://www.npmjs.com/package/downsample)
- [`lttb-py`](https://pypi.org/project/lttb/)

## 🛠️ Configuration

You can easily modify the test conditions by tweaking the `.env` file at the root of the project. Key variables you can adjust include dataset size (`TOTAL_ROWS`), batch processing size (`BATCH_SIZE`), downsample target (`THRESHOLD`), and container memory limits (`MEMORY_LIMIT`).

## 🚦 Getting Started

### Prerequisites
Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Run the Benchmark
1. **Start the suite:**
   ```bash
   docker compose up --build
   ```
2. **View the Results:**
   Open your browser and navigate to [http://localhost:3015](http://localhost:3015).
   *Grafana is pre-configured—no login required.*

### Cleanup
To stop the containers and remove the associated data:
```bash
docker compose down -v
```

## 🤝 Contributing

We welcome new additions! If you want to add your own LTTB implementation to this repository, feel free to submit a PR.
