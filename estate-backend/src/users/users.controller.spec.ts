import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@automock/jest';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;


  const hashedPassword = "jasdfuasndyaa"
  const mockUser = {
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
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    usersController = unit;
    usersService = unitRef.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clears mock data after each test
  });

  // ✅ Test Create User
  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'sue',
        email: 'test@codefactory.ai',
        password: '123123',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  // ✅ Test Find All Users
  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([mockUser]);

      const result = await usersController.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  // ✅ Test Find One User
  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      const result = await usersController.findOne(1);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValue(new NotFoundException('User not found'));

      await expect(usersController.findOne(999)).rejects.toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(999);
    });
  });

  // ✅ Test Update User
  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      jest.spyOn(usersService, 'update').mockResolvedValue({ ...mockUser, name: 'Updated Name' });

      const result = await usersController.update(1, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result.name).toEqual('Updated Name');
    });
  });

  // ✅ Test Remove User
  describe('remove', () => {
    it('should remove a user and return the user ID', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(1);

      const result = await usersController.remove(1);

      expect(usersService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(usersService, 'remove').mockRejectedValue(new NotFoundException('User not found'));

      await expect(usersController.remove(999)).rejects.toThrow(NotFoundException);
      expect(usersService.remove).toHaveBeenCalledWith(999);
    });
  });
});
