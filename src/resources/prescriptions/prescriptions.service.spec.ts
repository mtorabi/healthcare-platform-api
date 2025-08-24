import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionsService } from './prescriptions.service';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';

describe('PrescriptionsService', () => {
  let service: PrescriptionsService;
  let entityManager: any;

  beforeEach(async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };
    const mockEntityManager = {
      transaction: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        { provide: getEntityManagerToken(), useValue: mockEntityManager },
      ],
    }).compile();

    service = module.get<PrescriptionsService>(PrescriptionsService);
    entityManager = module.get<EntityManager>(getEntityManagerToken());
    service['entityManager'] = entityManager;
    service['entityManager'].createQueryBuilder = jest.fn(() => mockQueryBuilder);
    service['mockQueryBuilder'] = mockQueryBuilder;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a prescription', async () => {
      const dto = { claim_id: 1, drug_code_atc: 'A', quantity: 2, line_cost: 10 };
      const created = { ...dto, claim: { claim_id: 1 } };
      const saved = { prescription_id: 1, ...created };
      entityManager.create.mockReturnValue(created);
      entityManager.save.mockResolvedValue(saved);
      await expect(service.create(dto as any)).resolves.toEqual(saved);
      expect(entityManager.create).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining(dto));
      expect(entityManager.save).toHaveBeenCalledWith(created);
    });
  });

  describe('findAll', () => {
    it('should return all prescriptions', async () => {
      const result = [{ prescription_id: 1 }];
      entityManager.find.mockResolvedValue(result);
      await expect(service.findAll()).resolves.toEqual(result);
      expect(entityManager.find).toHaveBeenCalledWith(expect.any(Function), { relations: ['claim'] });
    });
  });

  describe('findOne', () => {
    it('should return a prescription by id', async () => {
      const prescription = { prescription_id: 1 };
      entityManager.findOne.mockResolvedValue(prescription);
      await expect(service.findOne(1)).resolves.toEqual(prescription);
      expect(entityManager.findOne).toHaveBeenCalledWith(expect.any(Function), { where: { prescription_id: 1 }, relations: ['claim'] });
    });

    it('should throw NotFoundException if not found', async () => {
      entityManager.findOne.mockResolvedValue(undefined);
      await expect(service.findOne(2)).rejects.toThrow('Prescription #2 not found');
    });
  });

  describe('update', () => {
    it('should update and save a prescription', async () => {
      const dto = { drug_code_atc: 'B', quantity: 3 };
      const preload = { prescription_id: 1, ...dto };
      const saved = { ...preload };
      entityManager.preload.mockResolvedValue(preload);
      entityManager.save.mockResolvedValue(saved);
      await expect(service.update(1, dto as any)).resolves.toEqual(saved);
      expect(entityManager.preload).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ prescription_id: 1, ...dto }));
      expect(entityManager.save).toHaveBeenCalledWith(preload);
    });

    it('should throw NotFoundException if not found', async () => {
      entityManager.preload.mockResolvedValue(undefined);
      await expect(service.update(2, {} as any)).rejects.toThrow('Prescription #2 not found');
    });
  });

  describe('remove', () => {
    it('should delete a prescription', async () => {
      entityManager.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(entityManager.delete).toHaveBeenCalledWith(expect.any(Function), 1);
    });

    it('should throw NotFoundException if not found', async () => {
      entityManager.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(2)).rejects.toThrow('Prescription #2 not found');
    });
  });

  describe('topPrescribedDrugs', () => {
    it('should return top prescribed drugs with correct mapping', async () => {
      const mockRows = [
        { drug_code_atc: 'A01', count: '5' },
        { drug_code_atc: 'B02', count: '3' },
      ];
      service['mockQueryBuilder'].getRawMany.mockResolvedValue(mockRows);
      const from = new Date('2025-01-01T00:00:00.000Z');
      const to = new Date('2025-08-24T23:59:59.999Z');
      const count = 2;
      const result = await service.topPrescribedDrugs(from, to, count);
      expect(service['entityManager'].createQueryBuilder).toHaveBeenCalledWith(expect.any(Function), 'prescription');
      expect(service['mockQueryBuilder'].select).toHaveBeenCalledWith('drug_code_atc');
      expect(service['mockQueryBuilder'].addSelect).toHaveBeenCalledWith('COUNT(drug_code_atc)', 'count');
      expect(service['mockQueryBuilder'].leftJoin).toHaveBeenCalledWith('prescription.claim', 'claim');
      expect(service['mockQueryBuilder'].where).toHaveBeenCalledWith('claim.submission_date BETWEEN :from AND :to', { from, to });
      expect(service['mockQueryBuilder'].groupBy).toHaveBeenCalledWith('drug_code_atc');
      expect(service['mockQueryBuilder'].orderBy).toHaveBeenCalledWith('count', 'DESC');
      expect(service['mockQueryBuilder'].limit).toHaveBeenCalledWith(count);
      expect(result).toEqual([
        { drug_code_atc: 'A01', count: 5 },
        { drug_code_atc: 'B02', count: 3 },
      ]);
    });
  });
});
