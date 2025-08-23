// src/db/data-source.ts
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import seeders from './seeds';


config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    synchronize: configService.get<string>('NODE_ENV') === 'development', // TODO: migrations
    entities: ['src/entities/**/*.entity.ts'],
    seeds: seeders,
    factories: ['dist/database/factories/**/*.js'],

};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
