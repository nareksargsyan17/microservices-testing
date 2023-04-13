import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: number;
}
