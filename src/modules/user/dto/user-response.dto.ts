import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserResponseDto {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data: Partial<User>;
}
