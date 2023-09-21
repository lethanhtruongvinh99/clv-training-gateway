import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway(8001, { cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  connectedClient: string[] = [];
  users: number = 0;
  async handleConnection(client: Socket) {
    console.log(client.id, 'connected');
    this.connectedClient.push(client.id);
    this.users++;
    this.server.emit('users', this.users);
  }

  async handleDisconnect(client: Socket) {
    this.connectedClient = this.connectedClient.filter(
      (id) => id !== client.id,
    );
    console.log(client.id);
    this.users--;
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('users')
  async onNewUser(@MessageBody() body: any) {
    // client.broadcast.emit('users', Body);
    console.log(body);
  }

  async sendMessage(payload: any) {
    this.server.emit('users', 'some users is logged in');
  }
}
