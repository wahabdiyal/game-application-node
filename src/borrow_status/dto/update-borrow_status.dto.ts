import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowStatusDto } from './create-borrow_status.dto';

export class UpdateBorrowStatusDto extends PartialType(CreateBorrowStatusDto) {}
