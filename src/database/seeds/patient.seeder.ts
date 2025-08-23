import { Gender } from "src/entities/gender";
import { Patient } from "src/entities/patient.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class PatientSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "patient" RESTART IDENTITY CASCADE;');

    const patientFactory = factoryManager.get(Patient);

    // save 10 factory generated entities, to the database
    await patientFactory.saveMany(10);
    console.log('Seeded 10 patients');
  }
}