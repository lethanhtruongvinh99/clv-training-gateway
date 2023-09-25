import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthenticationGuardVersion2 implements CanActivate {
  // in this context
  // after getting the authorization token
  // call a service to User service to verify this token
  // response with the payload
  constructor(private readonly appService: AppService) {}
  getToken = (token) => {
    if (token.startsWith('Bearer ')) {
      return token.slice(7, token.length);
    }
    return token;
  };
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.getToken(
      context.switchToHttp().getRequest().headers['authorization'],
    );
    console.log(await this.appService.validateToken(token));
    return true;
  }
}
