import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { Patient } from 'src/resources/patients/entities/patient.entity';
import { Prescription } from 'src/resources/claims/entities/prescription.entity';
import { ClaimDiagnosis } from 'src/resources/claims/entities/claim_diagnosis.entity';
import { Claim } from 'src/resources/claims/entities/claim.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USER'),
            password: config.get<string>('DB_PASS'),
            database: config.get<string>('DB_NAME'),
            entities: [Patient, Claim, ClaimDiagnosis, Prescription],
            synchronize: true,
            autoLoadEntities: true,
      }),
    })],
    providers: [],
    exports: [],
})
export class DatabaseModule {}
