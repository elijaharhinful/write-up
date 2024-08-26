import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailsService } from '../../emails/emails.service';
import { mockUserService } from '../../user/mocks/user.mocks';
import { mockJwtService, mockLogger, mockUser, newMockUser } from '../mocks/auth.mocks';
import { mockEmailsService } from '../../emails/mocks/emails.mocks';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { CustomNotFoundException, CustomUnauthorizedException } from '../../../helpers/custom-exceptions';
import { User, UserRole } from '../../user/entities/user.entity';


jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailsService>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailsService, useValue: mockEmailsService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailsService);
    logger = module.get(WINSTON_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        firstName: "John",
        lastName: "Doe",
        email: 'test@example.com',
        role: 'user',
        isActive: true,
      });
    });

    it('should return null if user is not found', async () => {
      userService.getUserByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@examle.com', 'password');
      expect(result).toBeNull();
    })
  });

  describe('login', () => {
    it('should return login response with access token', async () => {
      jwtService.signAsync.mockResolvedValue('mockedToken');
      const result = await service.login(mockUser);
      expect(result).toEqual({
        statusCode: 200,
        message: "User login successful",
        data: {
          user: {
            id: '1',
            firstName: "John",
            lastName: "Doe",
            email: 'test@example.com',
            role: 'user',
            isActive: true,
          },
          access_token: 'mockedToken',
        },
      });
    });

    it('should throw UnauthorizedException if userData is null', async () => {
      await expect(service.login(null)).rejects.toThrow(CustomUnauthorizedException);
    });
  });

  describe('register', () => {
    it('should regiter a new user', async () => {
      userService.getUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashPassword');
      userService.createUser.mockResolvedValue({ ...newMockUser, password: 'hashedPassword' } as User);

      const result = await service.register(newMockUser);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Registration successful',
        data: {
          id: '2',
          firstName: 'New',
          lastName: 'User',
          email: 'new@example.com',
          phone: '1234567890',
          role: UserRole.USER,
          isActive: true,
        }
      });
    });

    it('should throw UnauthorizedException if email is already in use', async ()=>{
      userService.getUserByEmail.mockResolvedValue(mockUser as User);
      await expect(service.register({ firstName: 'Some', lastName: 'User', email: 'test@example.com', password: 'password', phone: '1234567890' }))
      .rejects.toThrow(CustomUnauthorizedException);
    });
  });

  describe('forgetPassword', () => {
    it('should send reset password email', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser as User);
      jwtService.signAsync.mockResolvedValue('resetToken');

      const result = await service.forgetPassword('test@example.com');

      expect(mockEmailsService.sendEmail).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Password reset link has been sent to your email',
        data: [],
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(service.forgetPassword('nonexistent@example.com')).rejects.toThrow(CustomNotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      jwtService.verify.mockReturnValue({ email: 'test@example.com' });
      userService.getUserByEmail.mockResolvedValue(mockUser as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      const result = await service.resetPassword('validToken', 'newPassword');

      expect(userService.updateUserPassword).toHaveBeenCalledWith('1', 'newHashedPassword');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Password reset successful',
        data: [],
      });
    });

    it('should throw NotFoundException if user is not found during reset', async () => {
      jwtService.verify.mockReturnValue({ email: 'nonexistent@example.com' });
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(service.resetPassword('validToken', 'newPassword')).rejects.toThrow(CustomNotFoundException);
    });
  });
});
