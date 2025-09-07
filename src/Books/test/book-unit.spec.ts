import { Test,TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BooksService } from "../books.service";
import { Book } from "../book.entity";
import { CreateBookDto } from "../dtos/create-book-dtos";


describe("BooksService" , () => {
    let service:BooksService;
    let repository:jest.Mocked<typeof mockRepository>;

    const mockRepository = {
    find:jest.fn(),
    findAndCount:jest.fn(),
    findOneBy:jest.fn(),
    create:jest.fn(),
    save:jest.fn(),
    delete:jest.fn(),
    merge:jest.fn(),
};

beforeEach(async () => {
    const module:TestingModule = await Test.createTestingModule({
        providers:[
            BooksService,
            {provide:getRepositoryToken(Book),useValue:mockRepository},
        ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get(getRepositoryToken(Book));
    jest.clearAllMocks();
});

it("should create and return a book" , async () => {
    const dto:CreateBookDto = {
        title:'my Book',
        author:'Ahmed',
        price:50,
    }as any;

    const createdBook = {...dto} as Book;
    const savedBook = {...createdBook,id:1} as Book;

    repository.create.mockReturnValue(createdBook);
    repository.save.mockResolvedValue(savedBook);

    const result = await service.createBook(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.create).toHaveBeenCalledTimes(1);

    expect(repository.save).toHaveBeenCalledWith(createdBook);
    expect(repository.save).toHaveBeenCalledTimes(1);

    expect(result).toEqual(savedBook);
});

it("should throw when save fails" , async () => {
    const dto = {title: 'Fail Book', author: 'X', price: 10 } as any;
    const createdBook = {...dto} as Book;

    repository.create.mockReturnValue(createdBook);
    repository.save.mockRejectedValue(new Error('DB error'));


    await expect(service.createBook(dto)).rejects.toThrow('DB error');

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledTimes(1);
});

it("should return paginated data with correct metadata " , async () => {
    const page = 2;
    const limit = 10;
    const data = [
        {id:11,title:'B1'} as Book,
        {id:12,title:'B2'} as Book,
    ];
    repository.findAndCount.mockResolvedValue([data,23]);

    const result = await service.findAll(page,limit);

    expect(repository.findAndCount).toHaveBeenCalledWith({
        skip:(page - 1) * limit,
        take:limit,
    });
    expect(result).toEqual({
        data,
        total:23,
        page,
        limit,
        totalPages:3,
    });
    expect(repository.findAndCount).toHaveBeenCalledTimes(1);
});

it("should handle empty results (total = 0)",async () => {
    const page = 1;
    const limit = 5;
    repository.findAndCount.mockResolvedValue([[],0]);

    const result = await service.findAll(page,limit);

    expect(repository.findAndCount).toHaveBeenCalledWith({
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
    expect(repository.findAndCount).toHaveBeenCalledTimes(1);
});

it("should return a book when found",async () => {
    const book = {id:1,title:'My Book' , author:'Mohamed'} as Book;
    repository.findOneBy.mockResolvedValue(book);

    const result = await service.findOne(1);

    expect(repository.findOneBy).toHaveBeenCalledWith({id:1});
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(book);
});

it("should throw NotFoundException when book not found" , async ()=> {
    repository.findOneBy.mockResolvedValue(null);

    await expect (service.findOne(999)).rejects.toThrow('Book with id 999 not found');

    expect(repository.findOneBy).toHaveBeenCalledWith({id:999});
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
});

it("should update and return the book when found", async () => {
    const dto = {title:"Updated Title"} as Partial<CreateBookDto>;
    const existingBook = {id:1,title:"Old Title",author:"Ahmed"} as Book;
    const mergedBook = {...existingBook,...dto} as Book;

    repository.findOneBy.mockResolvedValue(existingBook);
    repository.merge.mockImplementation((book, dto) => {
    Object.assign(book, dto);
    });
    repository.save.mockResolvedValue(mergedBook);

    const result = await service.updateBook(1,dto);

    expect(repository.findOneBy).toHaveBeenCalledWith({id:1});
    expect(repository.merge).toHaveBeenCalledWith(existingBook,dto);
    expect(repository.save).toHaveBeenCalledWith(existingBook);
    expect(result).toEqual(mergedBook);
});

it("should throw NotFoundException when book not found" , async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.updateBook(999,{title:"No Nook"})).rejects.toThrow(
        "Book with id 999 not found"
    );

    expect(repository.findOneBy).toHaveBeenCalledWith({id:999});
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(repository.merge).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
});

it("should delete and return a success message" , async () => {
    const id = 1;
    repository.delete.mockResolvedValue({affected:1} as any);

    const result = await service.deleteBook(id);

    expect(repository.delete).toHaveBeenCalledWith(id);
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual({message:`Book with id ${id} deleted successfully`});
});
it("should throw NotFoundException when delete affects 0",async () => {
    const id = 999;
    repository.delete.mockResolvedValue({affected:0} as any);

    await expect(service.deleteBook(id)).rejects.toThrow(`Book with id ${id} not found`);

    expect(repository.delete).toHaveBeenCalledWith(id);
    expect(repository.delete).toHaveBeenCalledTimes(1);
});
});


