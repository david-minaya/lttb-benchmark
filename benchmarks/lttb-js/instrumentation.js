import { metrics } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'lttb-js',
  }),
  metricReader: new PrometheusExporter({
    port: 9464
  }),
  instrumentations: [
    getNodeAutoInstrumentations()
  ],
});

sdk.start();
new HostMetrics().start();
