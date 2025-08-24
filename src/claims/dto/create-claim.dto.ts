import { ApiProperty } from "@nestjs/swagger";

export class CreateClaimDto {
    @ApiProperty()
    public readonly patientId: string;

    @ApiProperty()
    public readonly submission_date: Date;

    @ApiProperty()
    public readonly reimbursement_date: Date;

    @ApiProperty()
    public readonly total_cost: number;


    @ApiProperty()
    public readonly icd10_codes: string[];

    @ApiProperty(
        {
            type: 'object',
            properties: {
                drug_code_atc: {
                    type: 'string',
                },
                quantity: {
                    type: 'number',
                },
                line_cost: {
                    type: 'number',
                }
            },
        }
    )
    public readonly prescriptions: {
        drug_code_atc: string;
        quantity: number;
        line_cost: number;
    }[];

}
