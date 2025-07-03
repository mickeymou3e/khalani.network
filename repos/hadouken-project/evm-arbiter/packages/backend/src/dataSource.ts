import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { getDefaultDbConfig } from './dbConfig';
export const AppDataSource = new DataSource({
  ...getDefaultDbConfig(),
});
