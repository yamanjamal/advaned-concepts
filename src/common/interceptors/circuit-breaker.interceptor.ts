import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly CircuitBreakerByHandler = new WeakMap<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function,
    CircuitBreaker
  >();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();

    let circuteBreaker: CircuitBreaker;
    if (this.CircuitBreakerByHandler.has(methodRef)) {
      circuteBreaker = this.CircuitBreakerByHandler.get(methodRef);
    } else {
      circuteBreaker = new CircuitBreaker();
      this.CircuitBreakerByHandler.set(methodRef, circuteBreaker);
    }
    return circuteBreaker.exec(next);
  }
}
