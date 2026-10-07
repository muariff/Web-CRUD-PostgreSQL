import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity.js';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';

@Injectable()
export class AssetService {
  constructor(@InjectRepository(Asset) private readonly repo: Repository<Asset>) {}

  findAll() {
    return this.repo.find({ order: { asset_id: 'ASC' } });
  }

  async findOne(id: number) {
    const asset = await this.repo.findOneBy({ asset_id: id });
    if (!asset) throw new NotFoundException(`Asset dengan id ${id} tidak ditemukan`);
    return asset;
  }

  create(dto: CreateAssetDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateAssetDto) {
    const asset = await this.findOne(id);
    Object.assign(asset, dto);
    return this.repo.save(asset);
  }

  async remove(id: number) {
    const asset = await this.findOne(id);
    await this.repo.remove(asset);
    return { message: `Asset dengan id ${id} berhasil dihapus` };
  }
}