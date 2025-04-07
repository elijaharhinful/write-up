import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateBlogDTO {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsArray()
    imageUrls?: string[];

    @ApiProperty()
    @IsArray()
    tags?: string[];
}
