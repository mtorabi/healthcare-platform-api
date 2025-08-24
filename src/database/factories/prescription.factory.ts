import { setSeederFactory } from 'typeorm-extension';
import { Claim } from '../../claims/entities/claim.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Prescription } from 'src/claims/entities/prescription.entity';

export default setSeederFactory(Prescription, (faker) => {
    const prescription = new Prescription();
    prescription.claim = new Claim();
    prescription.claim.claim_id = Math.floor(Math.random() * 100) + 1;
    prescription.quantity = Math.floor(Math.random() * 10) + 1;

    prescription.line_cost = parseFloat(faker.finance.amount({ min: 1, max: 50 }));
    prescription.drug_code_atc = faker.string.alphanumeric(7).toUpperCase();
    return prescription;
});
