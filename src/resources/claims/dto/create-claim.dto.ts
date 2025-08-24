import { ApiProperty } from "@nestjs/swagger";

export class CreateClaimDto {
    @ApiProperty()
    public readonly patientId: number;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2023-10-05T14:48:00.000Z',
    })
    public readonly submission_date: Date;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2023-10-05T14:48:00.000Z',
    })
    public readonly reimbursement_date: Date;

    @ApiProperty()
    public readonly total_cost: number;


    @ApiProperty()
    public readonly icd10_codes: string[];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                drug_code_atc: { type: 'string' },
                quantity: { type: 'number' },
                line_cost: { type: 'number' },
            },
            required: ['drug_code_atc', 'quantity', 'line_cost'],
        },
        example: [
            { drug_code_atc: 'A01AB', quantity: 2, line_cost: 50.0 },
        ],
    })
    public readonly prescriptions: {
        drug_code_atc: string;
        quantity: number;
        line_cost: number;
    }[];

}
