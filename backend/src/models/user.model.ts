import sql from "../db.js";

export interface User {
  user_id       : number;
  username      : string;
  password_hash : string;
  role          : string;
  branch_id     : number;
  is_approved   : boolean;
  created_at    : Date;
}

export const getUserById = async (id: number) => {
  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user;
};
