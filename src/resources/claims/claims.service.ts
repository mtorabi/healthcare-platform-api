import { Injectable } from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { InjectEntityManager } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { ClaimDiagnosis } from './entities/claim_diagnosis.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { EntityManager } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';

@Injectable()
export class ClaimsService {

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  public async create(createClaimDto: CreateClaimDto) {

    return await this.entityManager.transaction(async entityManager => {

      const patient = await entityManager.findOne(Patient, { where: { patient_id: createClaimDto.patientId } });
      if (!patient) {
        throw new Error('Patient not found');
      }
      const claim = await entityManager.save(Claim.fromDto(createClaimDto));

      // Save claim diagnoses
      if (createClaimDto.icd10_codes) {
        const diagnoses = createClaimDto.icd10_codes.map(code => {
          const claimDiagnosis = new ClaimDiagnosis();
          claimDiagnosis.claim = claim;
          claimDiagnosis.icd10_code = code;
          return claimDiagnosis;
        });

        await this.entityManager.save(diagnoses);
      }

      // Save prescriptions
      if (createClaimDto.prescriptions) {
        const prescriptions = createClaimDto.prescriptions?.map(prescription => {
          const claimPrescription = new Prescription();
          claimPrescription.claim = claim;
          claimPrescription.line_cost = prescription.line_cost;
          claimPrescription.quantity = prescription.quantity;
          claimPrescription.drug_code_atc = prescription.drug_code_atc;
          return claimPrescription;
        });
        await this.entityManager.save(prescriptions);
      }

      return claim;
    });
  }


  async findAll(): Promise<Claim[]> {
    return this.entityManager.find(Claim, { relations: ['patient'] });
  }

  async findOne(id: number): Promise<Claim | null> {
    return this.entityManager.findOne(Claim, {
      where: { claim_id: id },
      relations: ['patient'],
    });
  }

  async update(id: number, updateClaimDto: UpdateClaimDto): Promise<Claim | null> {
    const claim = await this.entityManager.findOne(Claim, { where: { claim_id: id } });
    if (!claim) return null;
    // Update fields if present in DTO
    if (updateClaimDto.submission_date) claim.submission_date = new Date(updateClaimDto.submission_date).toISOString();
    if (updateClaimDto.reimbursement_date) claim.reimbursement_date = new Date(updateClaimDto.reimbursement_date).toISOString();
    if (updateClaimDto.total_cost !== undefined) claim.total_cost = updateClaimDto.total_cost;
    // Optionally update patient if patientId is present
    if (updateClaimDto.patientId) {
      const patient = await this.entityManager.findOne(Patient, { where: { patient_id: updateClaimDto.patientId } });
      if (patient) claim.patient = patient;
    }
    return this.entityManager.save(claim);
  }

  async remove(id: number): Promise<boolean> {
      await this.entityManager.delete(Claim, { claim_id: id });
      return true;
  }
}
