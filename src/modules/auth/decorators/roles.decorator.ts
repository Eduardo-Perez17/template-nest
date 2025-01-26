import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

// Auth decorator
import { DecoratorRoleType } from './';

// Commons
import { ROLES } from 'src/commons/models';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);

export const AllRoles = (): DecoratorRoleType =>
    applyDecorators(
      SetMetadata(ROLES_KEY, Object.values(ROLES)),
      ApiOperation({ description: 'All roles are allowed for this operation.' })
    );