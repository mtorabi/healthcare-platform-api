import { Claim } from "src/resources/claims/entities/claim.entity";
import { ClaimDiagnosis } from "src/resources/claims/entities/claim_diagnosis.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class ClaimDiagnosisSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "claim_diagnosis" RESTART IDENTITY CASCADE;');

    const claimDiagnosisFactory = factoryManager.get(ClaimDiagnosis);
    // Fetch all claims as Claim entities
    const claimRepo = dataSource.getRepository('Claim');
    const claims = await claimRepo.find();
    
    const diagnosesToSave: ClaimDiagnosis[] = await Promise.all(
        claims.map(async (claim) => {
          const diagnosis = await claimDiagnosisFactory.make();
          diagnosis.claim = new Claim();
          diagnosis.claim.claim_id = claim.claim_id;
          return diagnosis;
        })
      );

    // Use repository to save all diagnoses
    await dataSource.getRepository(ClaimDiagnosis).save(diagnosesToSave);
  console.log(`Seeded at least one claim diagnosis for each claim (${claims.length} total)`);
  }
}