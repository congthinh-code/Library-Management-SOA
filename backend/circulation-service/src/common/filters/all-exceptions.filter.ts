import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType();
    const requestId = randomUUID();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const resObj = response as Record<string, any>;
        message = resObj.message || exception.message;
        error = resObj.error || HttpStatus[statusCode] || 'Error';
      }
    } else if (exception instanceof Error) {
      this.logger.error(`[${requestId}] Unhandled error: ${exception.message}`, exception.stack);
    }

    const errorPayload = {
      statusCode,
      message,
      error,
      requestId,
    };

    if (contextType === 'rpc') {
      return throwError(() => new RpcException(errorPayload));
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request && response) {
      response.status(statusCode).json(errorPayload);
    }
  }
}