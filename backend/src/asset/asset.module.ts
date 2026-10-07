import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity.js';
import { AssetController } from './asset.controller.js';
import { AssetService } from './asset.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}