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

export const newMockUser = {
  id: '2',
  email: 'new@example.com',
  password: 'Password',
  role: UserRole.USER,
  firstName: 'New',
  lastName: 'User',
  isActive: true,
  phone: '1234567890',
};

export const mockJwtService = {
  signAsync: jest.fn(),
  verify: jest.fn(),
};

export const mockLogger = {
  error: jest.fn(),
};