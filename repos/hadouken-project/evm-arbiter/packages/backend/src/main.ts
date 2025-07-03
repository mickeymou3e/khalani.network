import { createApp } from './createApp';
import { Command } from 'commander';
import { DataSource } from 'typeorm';
import { AppDataSource } from './dataSource';

const program = new Command();

export async function bootstrap() {
  console.log('Bootstrap on port:', process.env.PORT);
  const app = await createApp({
    cors: true,
  });
  await app.listen(process.env.BACKEND_PORT || 3001);
}

async function runMigrations() {
  let connection: DataSource = new DataSource({
    ...AppDataSource.options,
    logging: 'all',
    logger: 'simple-console',
  });

  try {
    connection = await connection.initialize();
    console.log(`Established connection with db: ${DataSource.name}`);

    await connection.runMigrations({
      transaction: 'all',
    });
    console.log('Finished running migrations');
  } catch (error) {
    console.error('run migrations error', error);
  } finally {
    console.log('Finally run migrations');
    await connection.destroy();
  }
}

program
  .name('EVM-arbiter')
  .description(
    'Indexes and analyses blockchain trace and compares with hardhat EVM traces to find if there any differences',
  )
  .version('0.0.1');

program
  .command('run-migrations')
  .description('runs typeorm db migrations')
  .action(async () => {
    console.log('Migrations are running');
    await runMigrations();
  });

program
  .command('http-server')
  .description('Run node app')
  .action(async () => {
    console.log('Node is starting');
    await bootstrap();
  });

program
  .command('run-indexer')
  .description('Run indexer')
  .action(async () => {
    console.log('TODO implement indexer');
  });

program.parse(process.argv);
