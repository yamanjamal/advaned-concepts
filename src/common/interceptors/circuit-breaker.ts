import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';

const SUCCSESS_THRESHOLD = 3; //the number of successful operations above which we close the circute
const FAILURE_THRESHOLD = 3; //the number of failuers operations above which we open the circute
const OPEN_TO_HALF_OPEN_WAIT_TIME = 6000; //1 minute

enum CircuitBreakerStatus {
  Closed,
  Opened,
  HalfOpen,
}

export class CircuitBreaker {
  private state = CircuitBreakerStatus.Closed;
  private failureCount = 0;
  private succsessCount = 0;
  private lastError: Error;
  private nextAtempt: number;

  exec(next: CallHandler) {
    if (this.state === CircuitBreakerStatus.Opened) {
      if (this.nextAtempt > Date.now()) {
        return throwError(() => this.lastError);
      }
      this.state = CircuitBreakerStatus.HalfOpen;
    }
    return next.handle().pipe(
      tap({
        next: () => this.handelSuccess,
        error: (err) => this.handelError(err),
      }),
    );
  }

  private handelSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitBreakerStatus.HalfOpen) {
      this.succsessCount++;

      if (this.succsessCount >= SUCCSESS_THRESHOLD) {
        this.succsessCount = 0;
        this.state = CircuitBreakerStatus.Closed;
      }
    }
  }

  private handelError(err: Error) {
    this.failureCount++;
    if (
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerStatus.HalfOpen
    ) {
      this.state = CircuitBreakerStatus.Opened;
      this.lastError = err;
      this.nextAtempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}
