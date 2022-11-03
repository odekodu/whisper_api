import { CreateUserDto } from "../../src/domains/users/dto/create-user.dto";
import { User } from "../../src/domains/users/entities/user.entity";
import { AccessRights } from "../../src/shared/access.right";

export const createUserStub: CreateUserDto = {
  email: 'any@mail.com',
  phone: '00000000000',
  firstname: 'any',
  lastname: 'user',
  right: AccessRights.CLIENT,
}

export const userStub: Partial<User> = {
  ...createUserStub,
  verified: false
}

