import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appService: AppService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '123',
    });
  }
  async validate(payload: any) {
    // check if payload.exp is expired --> return UnauthorizeException
    // else return user with this email
    // return this.authService.getOne(payload.sub);
    return payload.user;
  }
}
