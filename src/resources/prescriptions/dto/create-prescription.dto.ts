import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreatePrescriptionDto {

    @ApiProperty()
    public readonly claim_id: number;
    
    @ApiProperty()
    public readonly drug_code_atc: string;

    @ApiProperty()
    public readonly quantity: number;

    @ApiProperty()
    public readonly line_cost: number;
}
