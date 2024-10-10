import { ApiProperty } from "@nestjs/swagger";
import { BlogStatus } from "../entities/blog.entity";

export class BlogResponseDTO {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data: {
        id: string;
        title: string;
        content: string;
        imageUrls?: string[];
        tags?: string[];
        status: BlogStatus;
        scheduledAt?: Date;
        likes?: number;
        dislikes?: number;
        isSeeded?: boolean;
        author: string;
        createdAt: Date;
        updatedAt: Date;
    };
}