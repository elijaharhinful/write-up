import { User, UserRole } from '../../user/entities/user.entity';

export const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
};

export const mockJwtService = {
  signAsync: jest.fn(),
  verify: jest.fn(),
};

export const mockLogger = {
  error: jest.fn(),
};