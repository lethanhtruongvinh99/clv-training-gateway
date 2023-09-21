import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/decorators/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // this is a simple way. Just use knwon specific roles to verify
    // can use a more complex way to veriry --> fetch all Permission of the specific role
    // check whether this role has permission(s) to access this API (route)
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // console.log('requiredRoles', requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles = user.roles ? user.roles.map((role) => role.name) : [];
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}
