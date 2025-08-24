import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

describe('ClaimsController', () => {

  let controller: ClaimsController;
  let service: ClaimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [
        {
          provide: ClaimsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            claimCostPerPatient: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClaimsController>(ClaimsController);
    service = module.get<ClaimsService>(ClaimsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto = { patientId: 1, submission_date: new Date(), reimbursement_date: new Date(), total_cost: 100, icd10_codes: ['A01'], prescriptions: [] };
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);
      expect(await controller.create(dto as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return the result', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);
      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto and return the result', async () => {
      const dto = { total_cost: 200 };
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);
      expect(await controller.update('1', dto as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and return the result', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(true);
      expect(await controller.remove('1')).toEqual(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
  describe('claimCostPerPatient', () => {
    it('should call service.claimCostPerPatient with patientId and return the result', async () => {
      const result = 123.45;
      jest.spyOn(service, 'claimCostPerPatient').mockResolvedValue(result as any);
      expect(await controller.claimCostPerPatient(1)).toEqual(result);
      expect(service.claimCostPerPatient).toHaveBeenCalledWith(1);
    });

    it('should call service.claimCostPerPatient with undefined if patientId is not provided', async () => {
      const result = 456.78;
      jest.spyOn(service, 'claimCostPerPatient').mockResolvedValue(result as any);
      expect(await controller.claimCostPerPatient(undefined as any)).toEqual(result);
      expect(service.claimCostPerPatient).toHaveBeenCalledWith(undefined);
    });
  });
});
