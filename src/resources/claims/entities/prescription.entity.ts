import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, Index } from "typeorm";
import { Claim } from "./claim.entity";

@Check("CK_prescription_quantity_non_negative", "quantity >= 0")
@Check("CK_prescription_line_cost_non_negative", "line_cost >= 0")
@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  prescription_id: number;

  @ManyToOne(() => Claim)
  @JoinColumn({ name: "claim_id" })
  claim: Claim;

  @Index()
  @Column()
  drug_code_atc: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  line_cost: number;
}
