import { setSeederFactory } from 'typeorm-extension';
import { Claim } from '../../resources/claims/entities/claim.entity';
import { Prescription } from '../../resources/prescriptions/entities/prescription.entity';

export default setSeederFactory(Prescription, (faker) => {
    const prescription = new Prescription();
    prescription.claim = new Claim();
    prescription.claim.claim_id = Math.floor(Math.random() * 100) + 1;
    prescription.quantity = Math.floor(Math.random() * 10) + 1;

    prescription.line_cost = parseFloat(faker.finance.amount({ min: 1, max: 50 }));
    
    //it will generate just 20 unique drug codes
    prescription.drug_code_atc = 'CB123' + Math.floor(Math.random() * 20) + 1;
    return prescription;
});
