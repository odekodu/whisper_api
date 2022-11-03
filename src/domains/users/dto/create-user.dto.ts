import { AccessRights } from "src/shared/access.right";

export class CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  right: AccessRights
}
