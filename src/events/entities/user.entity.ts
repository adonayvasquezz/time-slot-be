export class User {
  id: string;
  externalId: string;
  email: string;
  name?: string;
  picture?: string;
  idpToken?: string;
  idpTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
