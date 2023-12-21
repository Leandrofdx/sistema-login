const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { getNodeAutoInstrumentations, } = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader, ConsoleMetricExporter, } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes, } = require('@opentelemetry/semantic-conventions');
const opentelemetry = require('@opentelemetry/api');


const tracer = opentelemetry.trace.getTracer(
    'instrumentation-scope-name',
    'instrumentation-scope-version',
  );


const sdk = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'SERVER-API-LOGIN',
        [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
    }),
    traceExporter: new ConsoleSpanExporter(),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();