import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Claim } from "./claim.entity";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

@Entity()
export class ClaimDiagnosis {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @OneToOne(() => Claim, claim => claim.claim_id, { cascade: true })
  @JoinColumn({ name: "claim_id" })
  @ApiProperty()
  claim: Claim;

  @Column()
  @ApiProperty()
  icd10_code: string;
}
