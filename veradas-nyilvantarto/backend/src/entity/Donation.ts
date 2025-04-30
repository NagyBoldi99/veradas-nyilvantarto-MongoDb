import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Location } from './Location';
import { Donor } from './Donor';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Location, { eager: true })
  location!: Location;

  @ManyToOne(() => Donor, { eager: true })
  donor!: Donor;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'boolean' })
  eligible!: boolean;

  @Column({ type: 'varchar', nullable: true })
  ineligibilityReason?: string;

  @Column({ type: 'varchar' })
  doctorName!: string;

  @Column({ type: 'boolean' })
  directedDonation!: boolean;

  @Column({ type: 'varchar', nullable: true })
  patientName?: string;

  @Column({ type: 'varchar', nullable: true })
  patientTaj?: string;
}
