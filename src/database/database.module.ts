import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { dataSourceOptions } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
    ],
    providers: [],
    exports: [],
})
export class DatabaseModule {}
