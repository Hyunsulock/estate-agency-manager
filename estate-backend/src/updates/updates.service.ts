import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdatesService {

    // private activeEditors: Record<
    //     string,
    //     Record<
    //         string,
    //         Record<
    //             string,
    //             Record<
    //                 string,
    //                 {
    //                     updatedBy: number;
    //                     name: string;
    //                     email: string;
    //                 }
    //             >
    //         >
    //     >
    // > = {};

    activeEditors: {
        [agencyId: number]: {
            [type: string]: {
                [id: number]: {
                    [field: string]: {
                        updatedBy: number;
                        name: string;
                        email: string;
                    };
                };
            };
        };
    } = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>
    ) {
    }

    async joinAgencyRoom(userData: { sub: number, agency?: number }, client: Socket) {
        console.log('hi', userData)
        const user = await this.userRepository.findOne({ where: { id: userData.sub } });
        if (!user) {
            throw new NotFoundException(`user with ID ${userData.sub} not found`);
        }

        if (userData.agency) {
            // Make sure agency exists (optional safety check)
            const agency = await this.agencyRepository.findOne({
                where: { id: userData.agency },
            });

            if (!agency) {
                throw new NotFoundException(
                    `Agency with ID ${userData.agency} not found`,
                );
            }

            // Join agency room
            const roomName = `agency/${userData.agency}`;
            client.join(roomName);

            // Optionally store user's agency on client data for easy reference
            client.data.user = {
                ...userData,
                name: user.name,
                email: user.email,
                agency: userData.agency,
            };
            console.log(client.data.user)
        }
    }

    setEditor(user: { sub: number; name: string; email: string; agency: number }, data: any) {
        const { type, id, field } = data;

        if (!this.activeEditors[user.agency]) {
            this.activeEditors[user.agency] = {};
        }
        if (!this.activeEditors[user.agency][type]) {
            this.activeEditors[user.agency][type] = {};
        }
        if (!this.activeEditors[user.agency][type][id]) {
            this.activeEditors[user.agency][type][id] = {};
        }

        this.activeEditors[user.agency][type][id][field] = {
            updatedBy: user.sub,
            name: user.name,
            email: user.email,
        };
    }

    clearEditorByField(user: { sub: number; agency: number }, data: any) {
        const { type, id, field } = data;
        const agencyEditors = this.activeEditors[user.agency];
        if (
            agencyEditors?.[type]?.[id]?.[field]?.updatedBy === user.sub
        ) {
            delete agencyEditors[type][id][field];

            // Clean up empty objects
            if (Object.keys(agencyEditors[type][id]).length === 0) {
                delete agencyEditors[type][id];
            }
            if (Object.keys(agencyEditors[type]).length === 0) {
                delete agencyEditors[type];
            }
        }
    }

    clearEditorsByUser(user: { sub: number; agency: number }) {
        const agencyEditors = this.activeEditors[user.agency];
        if (!agencyEditors) return [];

        const clearedEditors = [];

        for (const type in agencyEditors) {
            for (const idStr in agencyEditors[type]) {
                const id = Number(idStr);
                for (const field in agencyEditors[type][id]) {
                    if (agencyEditors[type][id][field].updatedBy === user.sub) {
                        clearedEditors.push({
                            type,
                            id,
                            field,
                            updatedBy: user.sub,
                            name: agencyEditors[type][id][field].name,
                            email: agencyEditors[type][id][field].email,
                        });
                        delete agencyEditors[type][id][field];
                    }
                }
                if (Object.keys(agencyEditors[type][id]).length === 0) {
                    delete agencyEditors[type][id];
                }
            }
            if (Object.keys(agencyEditors[type]).length === 0) {
                delete agencyEditors[type];
            }
        }
        return clearedEditors;
    }

    getCurrentEditors(agencyId: number) {
        const agencyEditors = this.activeEditors[agencyId] ?? {};
        const snapshot = [];

        for (const type in agencyEditors) {
            for (const id in agencyEditors[type]) {
                for (const field in agencyEditors[type][id]) {
                    const editor = agencyEditors[type][id][field];
                    snapshot.push({
                        type,
                        id: Number(id),
                        field,
                        updatedBy: editor.updatedBy,
                        name: editor.name,
                        email: editor.email,
                    });
                }
            }
        }

        return snapshot;
    }

}
