
import { Prescription } from "src/claims/entities/prescription.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class PrescriptionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "prescription" RESTART IDENTITY CASCADE;');

    const prescriptionFactory = factoryManager.get(Prescription);

    // save 1000 factory generated entities, to the database
    await prescriptionFactory.saveMany(1000);
    console.log('Seeded 1000 prescriptions');
  }
}