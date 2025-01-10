
{{/* DO NOT EDIT: This file was autogenerated. */}}

{{/*
    Otel Configuration
*/}}

{{/*
Renders the otel secret name
*/}}
{{- define "airbyte.otel.secretName" }}
{{- if .Values.global.metrics.otel.secretName }}
    {{- .Values.global.metrics.otel.secretName | quote }}
{{- else }}
    {{- .Release.Name }}-airbyte-secrets
{{- end }}
{{- end }}

{{/*
Renders the otel.otel.exporter environment variable
*/}}
{{- define "airbyte.otel.otel.exporter.env" }}
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_EXPORTER_OTLP_ENDPOINT
{{- end }}

{{/*
Renders the otel.otel.exporter.protocol environment variable
*/}}
{{- define "airbyte.otel.otel.exporter.protocol.env" }}
- name: OTEL_EXPORTER_OTLP_PROTOCOL
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_EXPORTER_OTLP_PROTOCOL
{{- end }}

{{/*
Renders the otel.otel.exporter.timeout environment variable
*/}}
{{- define "airbyte.otel.otel.exporter.timeout.env" }}
- name: OTEL_EXPORTER_OTLP_TIMEOUT
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_EXPORTER_OTLP_TIMEOUT
{{- end }}

{{/*
Renders the otel.otel.exporter.metricExportInterval environment variable
*/}}
{{- define "airbyte.otel.otel.exporter.metricExportInterval.env" }}
- name: OTEL_METRIC_EXPORT_INTERVAL
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_METRIC_EXPORT_INTERVAL
{{- end }}

{{/*
Renders the otel.otel.exporter.name environment variable
*/}}
{{- define "airbyte.otel.otel.exporter.name.env" }}
- name: OTEL_METRICS_EXPORTER
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_METRICS_EXPORTER
{{- end }}

{{/*
Renders the global.metrics.otel.otel.resourceAttributes value
*/}}
{{- define "airbyte.otel.otel.resourceAttributes" }}
    {{- (printf "service.name=%s,deployment.environment=%s,service.version=%s" (include "airbyte.componentName" .) .Values.global.env (include "airbyte.common.version" .)) }}
{{- end }}

{{/*
Renders the otel.otel.resourceAttributes environment variable
*/}}
{{- define "airbyte.otel.otel.resourceAttributes.env" }}
- name: OTEL_RESOURCE_ATTRIBUTES
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: OTEL_RESOURCE_ATTRIBUTES
{{- end }}

{{/*
Renders the set of all otel environment variables
*/}}
{{- define "airbyte.otel.envs" }}
{{- include "airbyte.otel.otel.exporter.env" . }}
{{- include "airbyte.otel.otel.exporter.protocol.env" . }}
{{- include "airbyte.otel.otel.exporter.timeout.env" . }}
{{- include "airbyte.otel.otel.exporter.metricExportInterval.env" . }}
{{- include "airbyte.otel.otel.exporter.name.env" . }}
{{- include "airbyte.otel.otel.resourceAttributes.env" . }}
{{- end }}

{{/*
Renders the set of all otel config map variables
*/}}
{{- define "airbyte.otel.configVars" }}
OTEL_EXPORTER_OTLP_ENDPOINT: {{ "http://$(DD_AGENT_HOST):4317" | quote }}
OTEL_EXPORTER_OTLP_PROTOCOL: {{ "grpc" | quote }}
OTEL_EXPORTER_OTLP_TIMEOUT: {{ 30000 | quote }}
OTEL_METRIC_EXPORT_INTERVAL: {{ 10000 | quote }}
OTEL_METRICS_EXPORTER: {{ "otlp" | quote }}
OTEL_RESOURCE_ATTRIBUTES: {{ (printf "service.name=%s,deployment.environment=%s,service.version=%s" (include "airbyte.componentName" .) .Values.global.env (include "airbyte.common.version" .)) | quote }}
{{- end }}
