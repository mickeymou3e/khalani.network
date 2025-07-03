import { DataSourceOptions } from 'typeorm';

const db_ssl = (process.env.DB_SSL || '0') == '1';
const db_ssl_check = (process.env.DB_SSL_CHECK || '1') == '1';

export const getDefaultDbConfig = (): DataSourceOptions => ({
  host: process.env.DB_HOST,
  type: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  ssl: db_ssl,
  extra: db_ssl ? { ssl: { rejectUnauthorized: db_ssl_check } } : {},
});
