import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTodoInterface {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
export class EditTodoInterface {

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}