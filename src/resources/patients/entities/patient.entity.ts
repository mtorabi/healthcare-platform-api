import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./gender";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  patient_id: number;

  @Column()
  @ApiProperty()
  year_of_birth: string;

  @Column({ type: "enum", enum: Gender })
  @ApiProperty()
  sex: Gender;
}