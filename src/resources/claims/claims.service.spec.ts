
import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { Patient } from '../patients/entities/patient.entity';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const mockEntityManager = {
      transaction: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        // Provide the correct token for @InjectEntityManager()
        { provide: getEntityManagerToken(), useValue: mockEntityManager },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
    entityManager = module.get<EntityManager>(getEntityManagerToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a claim with diagnoses and prescriptions', async () => {
      const createClaimDto: CreateClaimDto = {
        patientId: 1,
        icd10_codes: ['A01', 'B02'],
        prescriptions: [
          { line_cost: 10, quantity: 2, drug_code_atc: 'X123' },
        ],
        submission_date: new Date(2020, 0, 1).toISOString(),
        reimbursement_date: new Date(2020, 1, 1).toISOString(),
      } as any;

      const patient = { patient_id: 1 } as Patient;
      const claim = { claim_id: 1 } as Claim;

      (entityManager.transaction as jest.Mock).mockImplementation(async (cb) => {
        // Simulate the transaction callback
        return cb({
          findOne: jest.fn().mockResolvedValue(patient),
          save: jest.fn()
            .mockResolvedValueOnce(claim) // save claim
            .mockResolvedValueOnce([{}]) // save diagnoses
            .mockResolvedValueOnce([{}]), // save prescriptions
        });
      });

      const result = await service.create(createClaimDto);
      expect(result).toEqual(claim);
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('should throw error if patient not found', async () => {
      const createClaimDto: CreateClaimDto = { patientId: 2 } as any;
      (entityManager.transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn(),
        });
      });
      await expect(service.create(createClaimDto)).rejects.toThrow('Patient not found');
    });
  });

  describe('findAll', () => {
    it('should return all claims', async () => {
      const claims = [{ claim_id: 1 }, { claim_id: 2 }] as Claim[];
      (entityManager.find as jest.Mock).mockResolvedValue(claims);
      const result = await service.findAll();
      expect(result).toEqual(claims);
      expect(entityManager.find).toHaveBeenCalledWith(Claim, { relations: ['patient'] });
    });
  });

  describe('findOne', () => {
    it('should return a claim by id', async () => {
      const claim = { claim_id: 1 } as Claim;
      (entityManager.findOne as jest.Mock).mockResolvedValue(claim);
      const result = await service.findOne(1);
      expect(result).toEqual(claim);
      expect(entityManager.findOne).toHaveBeenCalledWith(Claim, {
        where: { claim_id: 1 },
        relations: ['patient'],
      });
    });
  });

  describe('update', () => {
    it('should update a claim if found', async () => {
      const claim = { claim_id: 1 } as any;
      const updateClaimDto: UpdateClaimDto = { total_cost: 100 } as any;
      (entityManager.findOne as jest.Mock).mockResolvedValue(claim);
      (entityManager.save as jest.Mock).mockResolvedValue({ ...claim, ...updateClaimDto });
      const result = await service.update(1, updateClaimDto);
      expect(result).toEqual({ ...claim, ...updateClaimDto });
    });

    it('should return null if claim not found', async () => {
      (entityManager.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.update(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a claim and return true', async () => {
      (entityManager.delete as jest.Mock).mockResolvedValue({});
      const result = await service.remove(1);
      expect(result).toBe(true);
      expect(entityManager.delete).toHaveBeenCalledWith(Claim, { claim_id: 1 });
    });
  });
});
