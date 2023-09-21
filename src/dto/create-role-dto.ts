export class CreateRoleDto {
  name?: string;
  description?: string;
  permissions?: Array<{ id: number }>;
}
