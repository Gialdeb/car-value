import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @AfterInsert()
  logInsert() {
    console.log('User Insert with ID: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User Updated with ID: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User Removed with ID: ', this.id);
  }
}
