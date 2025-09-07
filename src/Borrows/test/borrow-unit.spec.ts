import { TestingModule,Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Borrow, BorrowStatus } from "../borrow.entity";
import { BorrowsService } from "../borrow.service";
import { CreateBorrowDto } from "../dtos/create-borrow-dto";
import { Book } from "../../Books/book.entity";

describe("BorrowsService",() => {
    let service:BorrowsService;
    let borrowRepository:jest.Mocked<typeof mockRepository>;
    let bookRepository:jest.Mocked <typeof mockBookRepository>;


    const mockRepository = {
    find:jest.fn(),
    findAndCount:jest.fn(),
    findOne: jest.fn(),
    findOneBy:jest.fn(),
    create:jest.fn(),
    save:jest.fn(),
    delete:jest.fn(),
    merge:jest.fn(),
    };

    const mockBookRepository = {
        findOne:jest.fn(),
    };

    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                BorrowsService,
                {provide:getRepositoryToken(Borrow),useValue:mockRepository},
                {provide:getRepositoryToken(Book),useValue:mockBookRepository},
            ],
        }).compile();

        service = module.get<BorrowsService>(BorrowsService);
        borrowRepository = module.get(getRepositoryToken(Borrow));
        bookRepository = module.get(getRepositoryToken(Book));

        jest.clearAllMocks();
    });
    
    it("should create and return borrow",async () => {
        const dto:CreateBorrowDto = {
            userId:2,
            bookId:3,
            status:BorrowStatus.BORROWED,
        } as any;

        const createdBorrow = {...dto} as Borrow;
        const savedBorrow = {...createdBorrow , id:1} as Borrow;

        bookRepository.findOne.mockResolvedValue({id:dto.bookId} as Book);

        borrowRepository.create.mockReturnValue(createdBorrow);
        borrowRepository.save.mockResolvedValue(savedBorrow);

        const result = await service.createBorrow(dto);

        expect(bookRepository.findOne).toHaveBeenCalledWith({where:{id:dto.bookId}});

        expect(borrowRepository.create).toHaveBeenCalledWith(dto);
        expect(borrowRepository.create).toHaveBeenCalledTimes(1);

        expect(borrowRepository.save).toHaveBeenCalledWith(createdBorrow);
        expect(borrowRepository.save).toHaveBeenCalledTimes(1);

        expect(result).toEqual(savedBorrow);
    });

    it("should throw when save fails",async () => {
        const dto:CreateBorrowDto = {
            userId:2,
            bookId:3,
            status:BorrowStatus.BORROWED,
        } as any;

        const createdBorrow = {...dto} as Borrow;

        bookRepository.findOne.mockResolvedValue({id:dto.bookId} as Book);

        borrowRepository.create.mockReturnValue(createdBorrow);
        borrowRepository.save.mockRejectedValue(new Error("DB error"));

        await expect(service.createBorrow(dto)).rejects.toThrow("DB error");

        expect(borrowRepository.create).toHaveBeenCalledWith(dto);
        expect(borrowRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should return paginated data with correct metadata",async () => {
        const page = 2;
        const limit = 10;
        const data = [
            {userId:11,bookId:13} as Borrow,
            {userId:12,bookId:14} as Borrow,
        ];
        borrowRepository.findAndCount.mockResolvedValue([data,23]);

        const result = await service.findAll(page,limit);

        expect(borrowRepository.findAndCount).toHaveBeenCalledWith({
            skip:(page - 1) * limit,
            take:limit,
        });
        expect(result).toEqual({
            data,
            total:23,
            page,
            limit,
            totalPages:3
        });
        expect(borrowRepository.findAndCount).toHaveBeenCalledTimes(1);
    });

    it("should handle empty results (total = 0)" , async() => {
        const page = 1;
        const limit = 5;
        borrowRepository.findAndCount.mockResolvedValue([[],0]);

        const result = await service.findAll(page,limit);

        expect(borrowRepository.findAndCount).toHaveBeenCalledWith({
            skip:0,
            take:limit,
        });
        expect(result).toEqual({
            data:[],
            total:0,
            page,
            limit,
            totalPages:0,
        });
        expect(borrowRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
    
    it("should return a borrow when found",async () => {
        const borrow = {userId:11,bookId:12,status:BorrowStatus.BORROWED} as Borrow;
        borrowRepository.findOneBy.mockResolvedValue(borrow);

        const result = await service.getByID(11);

        expect(borrowRepository.findOneBy).toHaveBeenCalledWith({userId:11});
        expect(borrowRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect( result).toEqual(borrow);
    });

    it("should throw NotFoundException when borrow not found" , async () => {
        borrowRepository.findOneBy.mockResolvedValue(null);

        await expect (service.getByID(999)).rejects.toThrow('Borrow with id 999 not found');

        expect(borrowRepository.findOneBy).toHaveBeenCalledWith({userId:999});
        expect(borrowRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("should update and return the borrow when found" , async () => {
        const dto = {status:BorrowStatus.RETURNED} as Partial<CreateBorrowDto>;
        const existingBorrow = {userId:11,bookId:12,status:BorrowStatus.BORROWED} as Borrow;
        const mergedBorrow = {...existingBorrow,...dto} as Borrow;

        borrowRepository.findOneBy.mockResolvedValue(existingBorrow);
        borrowRepository.merge.mockImplementation((borrow,dto) =>{
            Object.assign(borrow,dto);
        });
        borrowRepository.save.mockResolvedValue(mergedBorrow);

        const result = await service.updateBorrow(11,dto);

        expect(borrowRepository.findOneBy).toHaveBeenCalledWith({id:11});
        expect(borrowRepository.merge).toHaveBeenCalledWith(existingBorrow,dto);
        expect(borrowRepository.save).toHaveBeenCalledWith(existingBorrow);
        expect(result).toEqual(mergedBorrow);
    });

    it("should throw NotFoundException when book not found" , async () => {
        borrowRepository.findOneBy.mockResolvedValue(null);

        await expect(service.updateBorrow(999,{status:BorrowStatus.BOUGHT})).rejects.toThrow(
            "Borrow with id 999 not found"
        );

        expect(borrowRepository.findOneBy).toHaveBeenCalledWith({id:999});
        expect(borrowRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(borrowRepository.merge).not.toHaveBeenCalled();
        expect(borrowRepository.save).not.toHaveBeenCalled();
    });
});