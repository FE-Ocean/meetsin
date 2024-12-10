import { Module } from '@nestjs/common';
import { PhaserGateway } from './phaser.gateway';

@Module({
  providers: [PhaserGateway]
})
export class PhaserModule {}
