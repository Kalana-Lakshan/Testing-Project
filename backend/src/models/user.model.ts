import sql from "../db.js";

export const getUserById = async (id: number) => {
  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user;
};
