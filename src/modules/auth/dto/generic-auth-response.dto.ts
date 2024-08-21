import { ApiProperty } from "@nestjs/swagger";

export class GenericAuthResponseDto {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data: [];
}
