import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./gender";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column()
  year_of_birth: string;

  @Column({ type: "enum", enum: Gender })
  sex: Gender;
}