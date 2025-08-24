import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { EntityManager } from 'typeorm';

describe('PrescriptionsController', () => {

  let controller: PrescriptionsController;
  let service: PrescriptionsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    topPrescribedDrugs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionsController],
      providers: [
        { provide: PrescriptionsService, useValue: mockService },
        EntityManager,
      ],
    }).compile();

    controller = module.get<PrescriptionsController>(PrescriptionsController);
    service = module.get<PrescriptionsService>(PrescriptionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and return result', async () => {
      const dto = { claim_id: 1, drug_code_atc: 'A01', quantity: 2, line_cost: 10 };
      const result = { ...dto, prescription_id: 1 };
      mockService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all prescriptions', async () => {
      const result = [{ prescription_id: 1 }, { prescription_id: 2 }];
      mockService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a prescription by id', async () => {
      const result = { prescription_id: 1 };
      mockService.findOne.mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the prescription', async () => {
      const dto = { quantity: 5 };
      const result = { prescription_id: 1, quantity: 5 };
      mockService.update.mockResolvedValue(result);
      expect(await controller.update('1', dto)).toEqual(result);
      expect(mockService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockService.remove.mockResolvedValue(undefined);
      expect(await controller.remove('1')).toBeUndefined();
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('topPrescribedDrugs', () => {
    it('should call service.topPrescribedDrugs with correct params', async () => {
      const result = [{ drug: 'A01', count: 5 }];
      mockService.topPrescribedDrugs.mockResolvedValue(result);
      const query = { from: new Date('2025-01-01T00:00:00.000Z'), to: new Date('2025-08-24T23:59:59.999Z'), count: 3 };
      expect(await controller.topPrescribedDrugs(query)).toEqual(result);
      expect(mockService.topPrescribedDrugs).toHaveBeenCalledWith(query.from, query.to, query.count);
    });

    it('should use default values if query params are missing', async () => {
      const result = [{ drug: 'A01', count: 5 }];
      mockService.topPrescribedDrugs.mockResolvedValue(result);
      const now = new Date();
  const response = await controller.topPrescribedDrugs({} as any);
      expect(response).toEqual(result);
      expect(mockService.topPrescribedDrugs).toHaveBeenCalledWith(new Date(0), expect.any(Date), 10);
    });
  });
});
