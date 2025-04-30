import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Donor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  gender!: string; // 'Férfi' vagy 'Nő'

  @Column({ type: 'varchar' })
  citizenship!: string;

  @Column({ type: 'varchar' })
  birthPlace!: string;

  @Column({ type: 'date' })
  birthDate!: Date;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'varchar', length: 9 })
  tajNumber!: string; // 9 számjegy, validáció kell majd!
}
