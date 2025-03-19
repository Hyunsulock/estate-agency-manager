import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UpdatesService } from './updates.service';
import { AuthService } from 'src/auth/auth.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()

export class UpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly updatesService: UpdatesService,
    private readonly authService: AuthService,
  ) {

  }
  handleDisconnect(client: Socket) {
    console.log(client)
  }
  async handleConnection(client: Socket) {
    try {
      // Bearer 'skjcvoizxcjvlzxicv'
      const rawToken = client.handshake.headers.authorization;

      const payload = await this.authService.parseBearerToken(rawToken, false);

      if (payload) {
        client.data.user = payload;
        // this.chatService.registerClient(payload.sub, client)
        await this.updatesService.joinAgencyRoom(payload, client);
      } else {
        client.disconnect();
      }
    } catch (e) {
      console.log(e);
      client.disconnect();
    }

    //console.log(client)
  }

  sendDataUpdate(agencyId: number, event: string, data: any) {
    this.server.to(`agency/${agencyId}`).emit(event, data);
  }
}
