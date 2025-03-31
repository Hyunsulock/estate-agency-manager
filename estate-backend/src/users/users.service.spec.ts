import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TestBed } from '@automock/jest';
import { Repository } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';


const hashedPassword = "jasdfuasndyaa"
const user = {
  id: 1,
  email: 'tardis302@gmail.com',
  password: hashedPassword,
  role: 2,
  name: null,
  agency: null,
  deals: null,
  savedHouseProperties: null,
  comments: null,
  createdAt: null,
  updatedAt: null,
  userHistory: null,
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let agencyRepository: jest.Mocked<Repository<Agency>>;
  let configService: jest.Mocked<ConfigService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile()
    userService = unit;
    userRepository = unitRef.get(getRepositoryToken(User) as string);
    agencyRepository = unitRef.get(getRepositoryToken(Agency) as string);
    configService = unitRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });


  afterAll(() => {
    jest.clearAllMocks();
  })



  describe("findAll", () => {
    it('should return all users', async () => {

      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      const result = await userService.findAll();

      expect(result).toEqual([user])
      expect(userRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne()', () => {
    it('should return a user by Id', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await userService.findOne(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['agency'] });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(userService.findOne(999)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 }, relations: ['agency'] });
    });
  });


  describe('remove()', () => {
    it('should remove a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await userService.remove(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(1)
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.remove(999)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  })

  describe("create", () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserDto = {
        name: 'sue',
        email: 'tardis302@gmail.com',
        password: 'mm12345'
      };
      const hashRounds = 10;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue(hashRounds);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const createdUser = await userService.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, hashRounds);
      expect(userRepository.save).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      });
      expect(createdUser).toEqual(user);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name:"sue",
        email: 'tardis302@gmail.com',
        password: 'mm12345',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      await expect(userService.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
    });
  });





  describe("update", () => {
    it("should update a user's name and return the updated user", async () => {
      const updateUserDto = { name: "Updated Name" };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...user, name: 'Updated Name' });

      const result = await userService.update(1, updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.update).toHaveBeenCalledWith({ id: 1 }, { name: "Updated Name" });
      expect(result.name).toEqual("Updated Name");
    });

    it("should hash password before updating", async () => {
      const updateUserDto = { password: "newpassword" };
      const hashedNewPassword = "hashedNewPassword";

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(configService, 'get').mockReturnValue(10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedNewPassword);
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        ...user,
        password: hashedNewPassword,
      });

      const result = await userService.update(1, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 10);
      expect(userRepository.update).toHaveBeenCalledWith({ id: 1 }, { password: hashedNewPassword });
      expect(result.password).toEqual(hashedNewPassword);
    });

    it("should update a user's agency", async () => {
      const updateUserDto = { agency: 1 };
      const agency = {
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "id": 1,
        "name": "runjump",
        "location": "seoul",
        "phoneNumber": "0102345893",
        apartments: null,
        staffs: null, offers: null, houseProperties: null, customers: null, comments: null, history: null
      };


      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(agencyRepository, 'findOne').mockResolvedValue(agency);
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        ...user,
        agency: agency,
      });

      const result = await userService.update(1, updateUserDto);

      expect(agencyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.update).toHaveBeenCalledWith({ id: 1 }, { agency });
      expect(result.agency).toEqual(agency);
    });

    it("should throw NotFoundException if user does not exist", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.update(999, { name: "Updated Name" })).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it("should throw NotFoundException if agency does not exist", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(agencyRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.update(1, { agency: 999 })).rejects.toThrow(NotFoundException);
      expect(agencyRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

});
