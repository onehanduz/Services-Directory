import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServicesDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  category_id: number;

  @IsString()
  location: string;
}
