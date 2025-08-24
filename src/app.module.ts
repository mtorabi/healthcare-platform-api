import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PatientsModule } from './resources/patients/patients.module';
import { ClaimsModule } from './resources/claims/claims.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PatientsModule,
    ClaimsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
