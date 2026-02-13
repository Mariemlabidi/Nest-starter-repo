import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
//import { Role } from '../auth/guards/roles.guards';
import{Role} from '../auth/enums/role.enum';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
}

