import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AssetModule } from './asset/asset.module.js';
import { Asset } from './asset/asset.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: c.get<string>('DB_HOST', 'localhost'),
        port: parseInt(c.get<string>('DB_PORT', '5432'), 10),
        username: c.get<string>('DB_USERNAME', 'postgres'),
        password: c.get<string>('DB_PASSWORD', ''), // Default value mencegah error undefined
        database: c.get<string>('DB_NAME', 'asset_fumindo'),
        entities: [Asset],
        synchronize: false,
      }),
    }),
    AssetModule,
  ],
})
export class AppModule {}