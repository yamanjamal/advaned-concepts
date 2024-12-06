import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FibonacciModule } from './fibonacci/fibonacci.module';
import { CoffiesModule } from './coffies/coffies.module';

@Module({
  imports: [FibonacciModule, CoffiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
