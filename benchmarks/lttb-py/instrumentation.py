from prometheus_client import start_http_server
from opentelemetry import metrics
from opentelemetry.exporter.prometheus import PrometheusMetricReader
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.system_metrics import SystemMetricsInstrumentor

start_http_server(port=9466, addr="0.0.0.0")

resource = Resource(attributes={"service.name": "lttb-py"})
reader = PrometheusMetricReader()
provider = MeterProvider(resource=resource, metric_readers=[reader])

metrics.set_meter_provider(provider)
SystemMetricsInstrumentor().instrument(meter_provider=provider)
