import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Claim } from "./claim.entity";

@Entity()
export class ClaimDiagnosis {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Claim, claim => claim.claim_id, { cascade: true })
  @JoinColumn({ name: "claim_id" })
  claim: Claim;

  @Column()
  icd10_code: string;
}
