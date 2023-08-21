import { PartialType } from '@nestjs/mapped-types';
import { CreateBannerCollectionDto } from './create-banner_collection.dto';

export class UpdateBannerCollectionDto extends PartialType(CreateBannerCollectionDto) {}
