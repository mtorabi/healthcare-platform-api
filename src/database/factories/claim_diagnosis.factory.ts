// src/db/factories/user.factory.ts
import { Claim } from 'src/claims/entities/claim.entity';
import { ClaimDiagnosis } from 'src/claims/entities/claim_diagnosis.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(ClaimDiagnosis, (faker) => {
  const claimDiagnosis = new ClaimDiagnosis();

    claimDiagnosis.claim = new Claim();
    claimDiagnosis.claim.claim_id = Math.floor(Math.random() * 100) + 1;
    claimDiagnosis.icd10_code = faker.string.alpha(1).toUpperCase()+faker.string.numeric({length:{min:10, max:999999}}).toString();

  return claimDiagnosis;
});
