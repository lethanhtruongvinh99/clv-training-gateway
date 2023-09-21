import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.trategy';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '60m' },
    }),
    ClientsModule.register([
      {
        name: 'USER_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'NOTIFICATION_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'VESSEL_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LocalStrategy,
    JWTStrategy,
    GoogleStrategy,
    AppGateway,
  ],
})
export class AppModule {}
