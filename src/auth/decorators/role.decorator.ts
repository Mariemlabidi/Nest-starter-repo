import { SetMetadata } from '@nestjs/common';
import { Role } from '../guards/roles.guards';
export const Roles = (...roles: Role[]) =>
  SetMetadata('roles', roles);
