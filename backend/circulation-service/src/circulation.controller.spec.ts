import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './circulation.controller'; // hoặc './app.controller' tùy tên file của bạn
import { CirculationService } from './circulation.service';

describe('AppController', () => {
  let appController: AppController;
  let circulationService: CirculationService;

  // Mock CirculationService
  const mockCirculationService = {
    createLoan: jest.fn(),
    returnLoan: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: CirculationService,
          useValue: mockCirculationService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    circulationService = app.get<CirculationService>(CirculationService);
  });

  describe('createLoan', () => {
    it('should call circulationService.createLoan with correct dto', async () => {
      const dto = { readerId: 'reader-1', bookCopyIds: ['copy-1', 'copy-2'] };
      const expectedResult = { id: 'loan-1', ...dto };

      jest.spyOn(circulationService, 'createLoan').mockResolvedValue(expectedResult as any);

      const result = await appController.createLoan(dto);
      expect(result).toEqual(expectedResult);
      expect(circulationService.createLoan).toHaveBeenCalledWith(dto);
    });
  });

  describe('returnLoan', () => {
    it('should call circulationService.returnLoan with loanId', async () => {
      const loanId = 'loan-1';
      const expectedResult = { id: loanId, status: 'RETURNED' };

      jest.spyOn(circulationService, 'returnLoan').mockResolvedValue(expectedResult as any);

      const result = await appController.returnLoan(loanId);
      expect(result).toEqual(expectedResult);
      expect(circulationService.returnLoan).toHaveBeenCalledWith(loanId);
    });
  });
});