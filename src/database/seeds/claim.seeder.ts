import { DataSource } from 'typeorm';
import { Claim } from '../../resources/claims/entities/claim.entity';
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class ClaimSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "claim" RESTART IDENTITY CASCADE;');

    const ClaimFactory = factoryManager.get(Claim);

    // save 100 factory generated entities, to the database
    await ClaimFactory.saveMany(100);
    console.log('Seeded 100 claims');
  }
}
