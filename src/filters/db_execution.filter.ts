import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DBExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorCode = (exception as any).code;

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'error';

        // Customize based on error code
        switch (errorCode) {
            case '23505': // Unique violation
                status = HttpStatus.CONFLICT;
                message = 'Duplicate entry';
                break;
            case '23503': // Foreign key violation
                status = HttpStatus.BAD_REQUEST;
                message = 'Invalid reference';
                break;
            case '23502': // Not null violation
                status = HttpStatus.BAD_REQUEST;
                message = 'Missing required field';
                break;
            case '23514': // Check violation
                status = HttpStatus.BAD_REQUEST;
                message = 'Check constraint failed';
                break;
        }
        console.log('error:', exception);
        response.status(status).json({
            statusCode: status,
            message,
            error: exception.message,
        });
    }
}