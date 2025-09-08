import { Test,TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "../users.service";
import { User } from "../user.entity";
import { Book } from "../../Books/book.entity";
import { CreateUserDto } from "../dtos/create-user-dto";

describe("UsersService",() => {
    let service: UsersService;
    let userRepository: jest.Mocked<typeof mockRepository>;
    let bookRepository: jest.Mocked<typeof mockBookRepository>;

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
        findOneBy:jest.fn(),
    };

    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                UsersService,
                {provide:getRepositoryToken(User),useValue:mockRepository},
                {provide:getRepositoryToken(Book),useValue:mockBookRepository},
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get(getRepositoryToken(User));
        bookRepository = module.get(getRepositoryToken(Book));

        jest.clearAllMocks();
    });

    it("should create and return user" , async () => {
        const dto:CreateUserDto = {
            name:'Ahmed',
            email:'Ahmed@gmail.com',
            password:'123456',
            age:23,
            emailConfirmed:true,
        } as any ;

        const createdUser = {...dto} as User;
        const savedUser = {...createdUser,id:1} as User;

        userRepository.create.mockReturnValue(createdUser);
        userRepository.save.mockResolvedValue(savedUser);

        const result = await service.createUser(dto);

        expect(userRepository.create).toHaveBeenCalledWith(dto);
        expect(userRepository.create).toHaveBeenCalledTimes(1);

        expect(userRepository.save).toHaveBeenCalledWith(createdUser);
        expect(userRepository.save).toHaveBeenCalledTimes(1);

        expect(result).toEqual(savedUser);
    });

    it("should throw when save fails", async () => {
        const dto:CreateUserDto = {
            name:'Ahmed',
            email:'Ahmed@gmail.com',
            password:'123456',
            age:23,
            emailConfirmed:true,
        } as any;
        const createdUser = {...dto} as User;

        userRepository.create.mockReturnValue(createdUser);
        userRepository.save.mockRejectedValue(new Error("DB error"));

        await expect(service.createUser(dto)).rejects.toThrow("DB error");

        expect(userRepository.create).toHaveBeenCalledWith(dto);
        expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should return paginated data with correct metadata",async () => {
        const page = 2;
        const limit = 10;
        const data = [
        {name:'Ahmed',email:'Ahmed@gmail.com'},
        {name:'Mohamed',email:'Mohamed@gmail.com'},
        ];
        userRepository.findAndCount.mockResolvedValue([data,23]);

        const result = await service.findAll(page,limit);

        expect(userRepository.findAndCount).toHaveBeenCalledWith({
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
        expect(userRepository.findAndCount).toHaveBeenCalledTimes(1);
    });

    it("should handle empty results (total = 0)" , async () => {
        const page = 1;
        const limit = 5;
        userRepository.findAndCount.mockResolvedValue([[],0]);

        const result = await service.findAll(page,limit);

        expect(userRepository.findAndCount).toHaveBeenCalledWith({
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
        expect(userRepository.findAndCount).toHaveBeenCalledTimes(1);
    });

    it("should return a user when found" , async ()=> {
        const user = {
            name:'Ahmed',
            email:'Ahmed@gmail.com',
            password:'123456',
            age:23,
            emailConfirmed:true,
        } as User;
        userRepository.findOneBy.mockResolvedValue(user);

        const result = await service.findOne(11);

        expect(userRepository.findOneBy).toHaveBeenCalledWith({id:11});
        expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
    });

    it("should throw NotFoundException when borrow not found" , async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.findOne(999)).rejects.toThrow('User with id 999 not found');

        expect(userRepository.findOneBy).toHaveBeenCalledWith({id:999});
        expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("should update and return the borrow when found" , async () => {
        const dto = {age:24} as Partial<CreateUserDto>;
        const existingUser = {
            name:'Ahmed',
            email:'Ahmed@gmail.com',
            password:'123456',
            age:20,
        } as User;
        const mergedUser = {...existingUser,...dto} as User;

        userRepository.findOneBy.mockResolvedValue(existingUser);
        userRepository.merge.mockImplementation((user,dto) => {
            Object.assign(user,dto);
        });
        userRepository.save.mockResolvedValue(mergedUser);

        const result = await service.updateUser(11,dto);

        expect(userRepository.findOneBy).toHaveBeenCalledWith({id:11});
        expect(userRepository.merge).toHaveBeenCalledWith(existingUser,dto);
        expect(userRepository.save).toHaveBeenCalledWith(existingUser);
        expect(result).toEqual(mergedUser);
    });

    it("should throw NotFoundException when book not found", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.updateUser(999,{age:50})).rejects.toThrow(
            "User with id 999 not found"
        );

        expect(userRepository.findOneBy).toHaveBeenCalledWith({id:999});
        expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(userRepository.merge).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should delete and return a success message", async () => {
        const userId = 1;
        userRepository.delete.mockResolvedValue({affected:1} as any);

        const result = await service.deleteUser(userId);

        expect(userRepository.delete).toHaveBeenCalledWith(userId);
        expect(userRepository.delete).toHaveBeenCalledTimes(1);
        expect(result).toEqual({message:`User with id ${userId} deleted successfully`});
    });

    it("should throw NotFoundException when delete affects 0",async ()=> {
        const userId = 999;
        userRepository.delete.mockResolvedValue({affected:0} as any);

        await expect(service.deleteUser(userId)).rejects.toThrow(`User with id ${userId} not found`);

        expect(userRepository.delete).toHaveBeenCalledWith(userId);
        expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
});