import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, Index } from "typeorm";
import { Patient } from "../../patients/entities/patient.entity";
import { CreateClaimDto } from "../dto/create-claim.dto";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

@Check("CK_claim_total_cost_non_negative", "total_cost >= 0")
@Check("CK_claim_submission_before_reimbursement", "submission_date < reimbursement_date")
@Entity()
export class Claim {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  claim_id: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  @Index()
  @ApiProperty()
  patient: Patient;

  @Index()
  @Column({ type: "date" })
  @ApiProperty()
  submission_date: string;

  @Index()
  @Column({ type: "date" })
  @ApiProperty()
  reimbursement_date: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ApiProperty()
  total_cost: number;

  public static fromDto(dto: CreateClaimDto): Claim {
    const claim = new Claim();
    claim.patient = new Patient();
    claim.patient.patient_id = dto.patientId;
    claim.submission_date = new Date(dto.submission_date).toISOString();
    claim.reimbursement_date = new Date(dto.reimbursement_date).toISOString();
    claim.total_cost = dto.total_cost;
    return claim;
  }
}
