import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { AssetCategory } from '../asset.entity.js';

export class CreateAssetDto {
  @IsString() @IsNotEmpty() @MaxLength(150)
  asset_name: string;

  @IsInt() @Min(0)
  stock_quantity: number;

  @IsEnum(AssetCategory, { message: 'category harus Consumable atau Non-Consumable' })
  category: AssetCategory;
}