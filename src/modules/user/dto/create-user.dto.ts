import { IsEmail, IsNotEmpty, IsString, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string
}
