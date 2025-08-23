import { setSeederFactory } from 'typeorm-extension';
import { Claim } from '../../entities/claim.entity';
import { Patient } from 'src/entities/patient.entity';

export default setSeederFactory(Claim, (faker) => {
    const claim = new Claim();
    // Set specific dates for the claim (q2 2023)
    const submission_date_q2_2023 = new Date(2023, 3, Math.floor(Math.random() * 30) + 1);
    claim.submission_date = submission_date_q2_2023.toISOString();

    //add a week to reimbursement_date
    claim.reimbursement_date = new Date(submission_date_q2_2023.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    claim.total_cost = parseFloat(faker.finance.amount());

    const patient = new Patient();
    patient.patient_id = Math.floor(Math.random() * 10) + 1;
    claim.patient = patient;
    return claim;
});
