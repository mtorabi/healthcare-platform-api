
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async create(createPrescriptionDto: CreatePrescriptionDto): Promise<Prescription> {
    const prescription = this.entityManager.create(Prescription, {
      ...createPrescriptionDto,
      claim: { claim_id: createPrescriptionDto.claim_id },
    });
    return this.entityManager.save(prescription);
  }

  async findAll(): Promise<Prescription[]> {
    return this.entityManager.find(Prescription, { relations: ['claim'] });
  }

  async findOne(id: number): Promise<Prescription> {
    const prescription = await this.entityManager.findOne(Prescription, {
      where: { prescription_id: id },
      relations: ['claim'],
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }
    return prescription;
  }

  async update(id: number, updatePrescriptionDto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.entityManager.preload(Prescription, {
      prescription_id: id,
      ...updatePrescriptionDto,
      claim: updatePrescriptionDto.claim_id ? { claim_id: updatePrescriptionDto.claim_id } : undefined,
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }
    return this.entityManager.save(prescription);
  }

  async remove(id: number): Promise<void> {
    const result = await this.entityManager.delete(Prescription, id);
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }
  }

  async topPrescribedDrugs(from: Date, to: Date, count: number): Promise<any[]> {
    // Use QueryBuilder to replicate the SQL query without passing raw SQL string
    const results = await this.entityManager
      .createQueryBuilder(Prescription, 'prescription')
      .select('drug_code_atc')
      .addSelect('COUNT(drug_code_atc)', 'count')
      .leftJoin('prescription.claim', 'claim')
      .where('claim.submission_date BETWEEN :from AND :to', {
        from: from,
        to: to,
      })
      .groupBy('drug_code_atc')
      .orderBy('count', 'DESC')
      .limit(count)
      .getRawMany();

    return results.map((row) => ({
      drug: row.drug_code_atc,
      count: Number(row.count),
    }));
  }
}
