import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from './schemas/countries.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Country', schema: CountrySchema }])],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService]
})
export class CountriesModule {}
