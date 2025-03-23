import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
    const user = client.data.user;
    if (user) {
      const clearedEditors = this.updatesService.clearEditorsByUser(user);

      // Emit 'done_editing' for each cleared editor only
      clearedEditors.forEach((editor) => {
        this.server.to(`agency/${user.agency}`).emit('done_editing', {
          type: editor.type,
          id: editor.id,
          field: editor.field,
        });
      });

      console.log(
        `Socket disconnected: ${client.id} — cleared active editors for user: ${user.sub}`
      );
    }
  }

  async handleConnection(client: Socket) {
    try {
      // Bearer 'skjcvoizxcjvlzxicv'
      const rawToken = client.handshake.auth.token;
      console.log("thisisraw", rawToken)

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


  @SubscribeMessage('request_active_editors')
  handleRequestActiveEditors(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    console.log('user-requerst', user)
    if (user) {
      const snapshot = this.updatesService.getCurrentEditors(user.agency);
      client.emit('active_editors_snapshot', snapshot);
    }
  }

  @SubscribeMessage('editing')
  handleEditing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (!user) return;

    this.updatesService.setEditor(user, data);
    console.log('editing')

    // Broadcast editing event to other users
    this.server.except(client.id).to(`agency/${user.agency}`).emit('editing', {
      type: data.type,
      id: data.id,
      field: data.field,
      updatedBy: user.sub,
      name: user.name,
      email: user.email,
    });
  }

  @SubscribeMessage('done_editing')
  handleDoneEditing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = client.data.user;
    console.log('done-editing')
    if (!user) return;

    this.updatesService.clearEditorByField(user, data);

    this.server.except(client.id).to(`agency/${user.agency}`).emit('done_editing', {
      type: data.type,
      id: data.id,
      field: data.field,
    });

  }



  sendDataUpdate(agencyId: number, event: string, data: any) {
    this.server.to(`agency/${agencyId}`).emit(event, data);
    console.log('connett')
  }

  // @SubscribeMessage('editing')
  // handleEditing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   const agencyRoom = `agency/${client.data.user.agency}`;
  //   // Broadcast to everyone in the agency room except the sender
  //   client.to(agencyRoom).emit('editing', {
  //     type: data.type,
  //     field: data.field,
  //     user: data.user,  // { updatedBy: userId, name: userName }
  //   });
  // }

  // // ✅ When frontend emits `done_editing`
  // @SubscribeMessage('done_editing')
  // handleDoneEditing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   const agencyRoom = `agency/${client.data.user.agency}`;
  //   client.to(agencyRoom).emit('done_editing', {
  //     type: data.type,
  //     field: data.field,
  //   });
  // }

  // private getAgencyRoomFromClient(client: Socket): string | null {
  //   const rooms = Array.from(client.rooms);
  //   const agencyRoom = rooms.find((room) => room.startsWith('agency/'));
  //   return agencyRoom ?? null;
  // }
}
