import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { metrics } from '@opentelemetry/api';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'lttb-stream-js',
  }),
  metricReader: new PrometheusExporter({
    port: 9468
  }),
  instrumentations: [
    getNodeAutoInstrumentations()
  ],
});

sdk.start();

new HostMetrics().start();

const meter = metrics.getMeter('nodejs-runtime-custom');

const memoryArrayBuffersGauge = meter.createObservableGauge('nodejs_process_memory_array_buffers_usage', {
  unit: 'bytes',
});

const memoryExternalGauge = meter.createObservableGauge('nodejs_process_memory_external_usage', {
  unit: 'bytes',
});

memoryArrayBuffersGauge.addCallback((result) => {
  result.observe(process.memoryUsage().arrayBuffers);
});

memoryExternalGauge.addCallback((result) => {
  result.observe(process.memoryUsage().external);
});
