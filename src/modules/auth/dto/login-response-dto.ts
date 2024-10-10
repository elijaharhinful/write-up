import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";

export class LoginResponseDto {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data: {
        user: Partial<User>;
        access_token: string;
    }
}
