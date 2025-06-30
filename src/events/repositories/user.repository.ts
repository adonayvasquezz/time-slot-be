import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserRepository } from './user.repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        externalId: userData.externalId!,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        idpToken: userData.idpToken,
        idpTokenExpiresAt: userData.idpTokenExpiresAt,
      },
    });

    return this.mapToEntity(user);
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { externalId },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        idpToken: userData.idpToken,
        idpTokenExpiresAt: userData.idpTokenExpiresAt,
      },
    });

    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.mapToEntity(user);
  }

  private mapToEntity(prismaUser: any): User {
    const user = new User();
    user.id = prismaUser.id;
    user.externalId = prismaUser.externalId;
    user.email = prismaUser.email;
    user.name = prismaUser.name;
    user.picture = prismaUser.picture;
    user.idpToken = prismaUser.idpToken;
    user.idpTokenExpiresAt = prismaUser.idpTokenExpiresAt;
    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    return user;
  }
}
