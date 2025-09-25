import type { Request, Response } from "express";
import { getActiveUserCount, getAllUser } from "../models/user.model.ts";
import type { User } from "../models/user.model.ts";



export const getUsers = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    const users: User[] = await getAllUser(Number(count) || 100, Number(offset) || 0);
    const user_count: Number = await getActiveUserCount();
    res.status(200).json({
      user_count: user_count,
      users: users
    });
  } catch (error) {
    console.error("Error in getUsers handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};