import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Claim } from "./claim.entity";

@Entity()
export class ClaimDiagnosis {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Claim)
  @JoinColumn({ name: "claim_id" })
  claim: Claim;

  @Column()
  icd10_code: string;
}
