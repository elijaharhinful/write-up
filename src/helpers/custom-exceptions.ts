import { BadRequestException, ForbiddenException, HttpStatus, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { BAD_REQUEST, FORBIDDEN_ACTION, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORISED_USER } from "./system-messages";

export class CustomBadRequestException extends BadRequestException{
    constructor(input: string = 'Input'){
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            error: BAD_REQUEST,
            message: `${input} is required`,
        });
    }
}

export class CustomUnauthorizedException extends UnauthorizedException{
    constructor(message: string = UNAUTHORISED_USER){
        super({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message,
        });
    }
}

export class CustomForbiddenException extends ForbiddenException{
    constructor(message: string = FORBIDDEN_ACTION){
        super({
            statusCode: HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message,
        });
    }
}

export class CustomNotFoundException extends NotFoundException{
    constructor(resource: string = 'Resource'){
        super({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message: `${resource} ${NOT_FOUND}`,
        });
    }
}

export class CustomInternalServerErrorException extends InternalServerErrorException{
    constructor(message: string = INTERNAL_SERVER_ERROR){
        super({
            statusCode: HttpStatus.FORBIDDEN,
            error: INTERNAL_SERVER_ERROR,
            message,
        });
    }
}
