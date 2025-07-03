import { loadEnvConfig } from "@next/env";

const loadEnvironments = () => loadEnvConfig(process.cwd());

loadEnvironments();
