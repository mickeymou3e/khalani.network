{{/*
Expand the name of the chart.
*/}}
{{- define "wallet-balance-monitor.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "wallet-balance-monitor.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "wallet-balance-monitor.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "wallet-balance-monitor.labels" -}}
helm.sh/chart: {{ include "wallet-balance-monitor.chart" . }}
{{ include "wallet-balance-monitor.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "wallet-balance-monitor.selectorLabels" -}}
app.kubernetes.io/name: {{ include "wallet-balance-monitor.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "wallet-balance-monitor.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "wallet-balance-monitor.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the ConfigMap object storing addresses and chains to be monitored.
*/}}
{{- define "wallet-balance-monitor.addressesConfigMapName" -}}
{{- printf "%s-addresses-config-map" .Release.Name | trunc 63 }}
{{- end }}

{{/*
Create the name of the Secrets object storing RPC URLs of the chains.
*/}}
{{- define "wallet-balance-monitor.rpcUrlsSecret" -}}
{{- printf "%s-rpc-urls-secrets" .Release.Name | trunc 63 }}
{{- end }}