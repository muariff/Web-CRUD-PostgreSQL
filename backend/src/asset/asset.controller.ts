import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssetService } from './asset.service.js';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';

@Controller('assets')
export class AssetController {
  constructor(private readonly service: AssetService) {}

  @Get()            findAll()                                   { return this.service.findAll(); }
  @Get(':id')       findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post()           create(@Body() dto: CreateAssetDto)         { return this.service.create(dto); }
  @Put(':id')       update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDto) { return this.service.update(id, dto); }
  @Delete(':id')    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}