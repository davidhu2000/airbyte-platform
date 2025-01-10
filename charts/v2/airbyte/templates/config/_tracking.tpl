
{{/* DO NOT EDIT: This file was autogenerated. */}}

{{/*
    Tracking Configuration
*/}}

{{/*
Renders the tracking secret name
*/}}
{{- define "airbyte.tracking.secretName" }}
{{- if .Values.global.tracking.secretName }}
    {{- .Values.global.tracking.secretName | quote }}
{{- else }}
    {{- .Release.Name }}-airbyte-secrets
{{- end }}
{{- end }}

{{/*
Renders the global.tracking.enabled value
*/}}
{{- define "airbyte.tracking.enabled" }}
    {{- .Values.global.tracking.enabled | default true }}
{{- end }}

{{/*
Renders the tracking.enabled environment variable
*/}}
{{- define "airbyte.tracking.enabled.env" }}
- name: TRACKING_ENABLED
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: TRACKING_ENABLED
{{- end }}

{{/*
Renders the global.tracking.strategy value
*/}}
{{- define "airbyte.tracking.strategy" }}
    {{- .Values.global.tracking.strategy | default "logging" }}
{{- end }}

{{/*
Renders the tracking.strategy environment variable
*/}}
{{- define "airbyte.tracking.strategy.env" }}
- name: TRACKING_STRATEGY
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: TRACKING_STRATEGY
{{- end }}

{{/*
Renders the global.tracking.segment.writeKeySecretKey value
*/}}
{{- define "airbyte.tracking.segment.writeKeySecretKey" }}
    {{- .Values.global.tracking.segment.writeKeySecretKey | default "7UDdp5K55CyiGgsauOr2pNNujGvmhaeu" }}
{{- end }}

{{/*
Renders the tracking.segment.writeKeySecretKey environment variable
*/}}
{{- define "airbyte.tracking.segment.writeKeySecretKey.env" }}
- name: SEGMENT_WRITE_KEY
  valueFrom:
    configMapKeyRef:
      name: {{ .Release.Name }}-airbyte-env
      key: SEGMENT_WRITE_KEY
{{- end }}

{{/*
Renders the set of all tracking environment variables
*/}}
{{- define "airbyte.tracking.envs" }}
{{- include "airbyte.tracking.enabled.env" . }}
{{- include "airbyte.tracking.strategy.env" . }}
{{- include "airbyte.tracking.segment.writeKeySecretKey.env" . }}
{{- end }}

{{/*
Renders the set of all tracking config map variables
*/}}
{{- define "airbyte.tracking.configVars" }}
TRACKING_ENABLED: {{ include "airbyte.tracking.enabled" . | quote }}
TRACKING_STRATEGY: {{ include "airbyte.tracking.strategy" . | quote }}
SEGMENT_WRITE_KEY: {{ include "airbyte.tracking.segment.writeKeySecretKey" . | quote }}
{{- end }}
