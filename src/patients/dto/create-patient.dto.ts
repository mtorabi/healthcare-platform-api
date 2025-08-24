import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../entities/gender";


export class CreatePatientDto {
    @ApiProperty()
    public readonly year_of_birth: string;

    @ApiProperty({ enum: Gender })
    public readonly sex: Gender;
}
