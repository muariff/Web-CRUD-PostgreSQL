import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AssetCategory {
  CONSUMABLE = 'Consumable',
  NON_CONSUMABLE = 'Non-Consumable',
}

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn({ name: 'asset_id' })
  asset_id: number;

  @Column({ name: 'asset_name', type: 'varchar', length: 150 })
  asset_name: string;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ type: 'enum', enum: AssetCategory, enumName: 'asset_category' })
  category: AssetCategory;
}