import { IsString, ArrayUnique } from 'class-validator';




export class CreateSignupRewardDto {
    
    @ArrayUnique()
    @IsString({ each: true }) // Make sure each element in the array is a string
    country: string[];

    start_time:string;
    end_time:string;
  }
