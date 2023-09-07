import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './schemas/package.schema';
import { CurrencyModule } from 'src/currency/currency.module';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"Package",schema:PackageSchema}]),CurrencyModule,CountriesModule],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
