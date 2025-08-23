import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, Index } from "typeorm";
import { Patient } from "./patient.entity";

@Check("CK_claim_total_cost_non_negative", "total_cost >= 0")
@Check("CK_claim_submission_before_reimbursement", "submission_date < reimbursement_date")
@Entity()
export class Claim {
  @PrimaryGeneratedColumn()
  claim_id: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  @Index()
  patient: Patient;

  @Index()
  @Column({ type: "date" })
  submission_date: string;

  @Index()
  @Column({ type: "date" })
  reimbursement_date: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_cost: number;
}
