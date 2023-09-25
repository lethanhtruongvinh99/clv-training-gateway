import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateVesselDto } from './dto/create-vessel-dto';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly userClient: ClientProxy,
    @Inject('NOTIFICATION_CLIENT')
    private readonly notificationClient: ClientProxy,
    @Inject('VESSEL_CLIENT')
    private readonly vesselClient: ClientProxy,
    private readonly appGateway: AppGateway,
    private readonly jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async sendNotification(message: string) {
    try {
      const response = this.notificationClient
        .send(
          {
            role: 'notification',
            cmd: 'send',
          },
          { message },
        )
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      return response;
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  // user zone

  async getUsers(queries: any) {
    try {
      return this.userClient.send(
        {
          role: 'user',
          cmd: 'get-all',
        },
        { queries },
      );
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async createUser(user: CreateUserDto) {
    try {
      return this.userClient.send(
        {
          role: 'user',
          cmd: 'create',
        },
        { user },
      );
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async getUser(id: number) {
    try {
      const response = this.userClient.send(
        {
          role: 'user',
          cmd: 'get-one',
        },
        { id },
      );
      return response;
    } catch (error) {
      Logger.log(error);
      return error;
    }
  }

  async updateUser(id: number, user: CreateUserDto) {
    try {
      return this.userClient.send(
        {
          role: 'user',
          cmd: 'update',
        },
        { id, user },
      );
    } catch (error) {
      Logger.log(error);
      return error;
    }
  }

  // authen zone
  async login(user: any) {
    const payload = {
      sub: user.id,
      user,
    };
    this.appGateway.sendMessage(`${user?.user?.email} logged in!`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async signup(user: CreateUserDto) {
    try {
      return this.userClient.send({ role: 'auth', cmd: 'signup' }, { user });
    } catch (error) {
      Logger.log(error);
      return error;
    }
  }

  async googleLogin(googleUser: any) {
    const user = await this.userClient
      .send(
        {
          role: 'auth',
          cmd: 'google',
        },
        { googleUser },
      )
      .toPromise();
    if (user) {
      const payload = { sub: user.id, user };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
  async validateUser(username: string, password: string) {
    try {
      const response = this.userClient
        .send({ role: 'auth', cmd: 'validate' }, { username, password })
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      return response;
    } catch (error) {
      Logger.log(error);
      return error;
    }
  }

  async validateToken(token: string) {
    try {
      const response = this.userClient
        .send({ role: 'auth', cmd: 'validate-token' }, { token })
        .toPromise();
      return response;
    } catch (error) {
      Logger.log(error);
      return error;
    }
  }

  // role zone
  async getRoles(queries: any) {
    try {
      return this.userClient.send(
        {
          role: 'role',
          cmd: 'get-all',
        },
        { queries },
      );
    } catch (error) {
      return error;
    }
  }

  async getRole(id: number) {
    try {
      return this.userClient.send(
        {
          role: 'role',
          cmd: 'get-one',
        },
        { id },
      );
    } catch (error) {
      return error;
    }
  }

  async createRole(role: CreateRoleDto) {
    try {
      return this.userClient.send(
        {
          role: 'role',
          cmd: 'create',
        },
        { role },
      );
    } catch (error) {
      return error;
    }
  }

  async updateRole(id: number, role: CreateRoleDto) {
    try {
      return this.userClient.send(
        {
          role: 'role',
          cmd: 'update',
        },
        { id, role },
      );
    } catch (error) {
      return error;
    }
  }

  // permission zone
  async getPermissions(queries: any) {
    try {
      return this.userClient.send(
        {
          role: 'permission',
          cmd: 'gett-all',
        },
        { queries },
      );
    } catch (error) {
      return error;
    }
  }

  async getPermission(id: number) {
    try {
      return this.userClient.send(
        {
          role: 'permission',
          cmd: 'get-one',
        },
        { id },
      );
    } catch (error) {
      return error;
    }
  }

  async createPermission(permission: CreatePermissionDto) {
    try {
      return this.userClient.send(
        {
          role: 'permission',
          cmd: 'create',
        },
        { permission },
      );
    } catch (error) {
      return error;
    }
  }

  async updatePermission(id: number, permission: CreatePermissionDto) {
    try {
      return this.userClient.send(
        {
          role: 'permission',
          cmd: 'update',
        },
        { id, permission },
      );
    } catch (error) {
      return error;
    }
  }

  // vessel zone
  async getVessels(queries: any) {
    try {
      console.log(queries);
      return this.vesselClient.send(
        {
          role: 'vessel',
          cmd: 'get-all',
        },
        { queries },
      );
    } catch (error) {
      console.log('!@#', error);
      return error;
    }
  }

  async getVessel(vessel_code: string) {
    try {
      return this.vesselClient.send(
        {
          role: 'vessel',
          cmd: 'get-one',
        },
        { vessel_code },
      );
    } catch (error) {
      return error;
    }
  }

  async createVessel(vessel: CreateVesselDto) {
    try {
      return this.vesselClient.send(
        {
          role: 'vessel',
          cmd: 'create',
        },
        { vessel },
      );
    } catch (error) {
      return error;
    }
  }

  async updateVessel(vessel_code: string, vessel: CreateVesselDto) {
    try {
      return this.vesselClient.send(
        {
          role: 'vessel',
          cmd: 'update',
        },
        { vessel_code, vessel },
      );
    } catch (error) {
      return error;
    }
  }
}
