import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdatesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async joinAgencyRoom(userData: { sub: number, agency?: number }, client: Socket) {
        console.log('hi')
        const user = await this.userRepository.findOne({ where: { id: userData.sub } });

        if (!user) {
            throw new NotFoundException(`user with ID ${userData.sub} not found`);
        }


        if (userData.agency) {
            client.join(`agency/${userData.agency}`);
            console.log(client)
        }
    }
}
