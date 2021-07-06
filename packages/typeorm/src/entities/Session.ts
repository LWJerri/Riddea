import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "sessions",
})
export class Session {
  @PrimaryGeneratedColumn()
  id: string;

  @Index()
  @Column("timestamp with time zone", { default : () => 'CURRENT_TIMESTAMP' })
  expireAt: number;

  @Index()
  @Column("varchar")
  sid: string;

  @Column("text")
  json: any;
}
