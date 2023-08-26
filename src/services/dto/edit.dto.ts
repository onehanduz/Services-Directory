import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditServicesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
