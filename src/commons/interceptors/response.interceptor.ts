import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseDto } from '../dtos';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          statusCode: response.statusCode,
          data,
        } as ResponseDto;
      }),
      catchError((error) => {
        return throwError(() => ({
          success: false,
          statusCode: error.status || 500,
          message: error.message || 'Unexpected error',
        }));
      }),
    );
  }
}
