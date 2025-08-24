
import { ApiProperty } from "@nestjs/swagger";
import { Claim } from "../../claims/entities/claim.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, Index } from "typeorm";

@Check("CK_prescription_quantity_non_negative", "quantity >= 0")
@Check("CK_prescription_line_cost_non_negative", "line_cost >= 0")
@Entity()
export class Prescription {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  prescription_id: number;

  @ManyToOne(() => Claim)
  @JoinColumn({ name: "claim_id" })
  @ApiProperty()
  claim: Claim;

  @Index()
  @Column()
  @ApiProperty()
  drug_code_atc: string;

  @Column({ type: "int" })
  @ApiProperty()  
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ApiProperty()
  line_cost: number;
}
