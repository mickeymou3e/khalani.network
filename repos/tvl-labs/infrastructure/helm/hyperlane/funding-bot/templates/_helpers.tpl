{{/*
Expand the name of the chart.
*/}}
{{- define "funding-bot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "funding-bot.fullname" -}}
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
{{- define "funding-bot.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "funding-bot.labels" -}}
helm.sh/chart: {{ include "funding-bot.chart" . }}
{{ include "funding-bot.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "funding-bot.selectorLabels" -}}
app.kubernetes.io/name: {{ include "funding-bot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "funding-bot.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "funding-bot.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the ConfigMap object storing addresses and chains to be monitored.
*/}}
{{- define "funding-bot.addressesConfigMapName" -}}
{{- printf "%s-addresses-config-map" .Release.Name | trunc 63 }}
{{- end }}

{{/*
Create the name of the Secrets object storing RPC URLs of the chains.
*/}}
{{- define "funding-bot.rpcUrlsSecret" -}}
{{- printf "%s-rpc-urls-secrets" .Release.Name | trunc 63 }}
{{- end }}