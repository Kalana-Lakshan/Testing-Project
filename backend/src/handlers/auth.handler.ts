import type { Request, Response } from "express";
import { getUserByUsername, type User } from "../models/user.model.ts";
import { comparePasswords } from "../auth/hash.ts";
import { generateToken } from "../auth/token.ts";


export const userLogin = async (req: Request, res: Response) => {
    let { username, password } = req.query;
    try {
        const user_DB: User | null = await getUserByUsername(String(username).trim());
        if (!user_DB) {
            return res.status(404).json({ error: "User not found" });
        }
        if (await comparePasswords(String(password), user_DB.password_hash)) {
            var token_string: string = generateToken({ userId: String(user_DB.user_id), username: user_DB.username, role: user_DB.role })
            res.status(200).json({ 
                message: "Login Successfully", 
                user: user_DB, 
                token: token_string 
            })
        } else {
            res.status(401).json({ error: "Wrong username or password" })
        }
    } catch (error) {
        console.error("Error in userLogin handler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const userSignup = async (req: Request, res: Response) => {
    let { username, password } = req.query;
}

export const patientSignup = async (req: Request, res: Response) => {
    let { username, password } = req.query;
}

export const validateUser = async (req: Request, res: Response) => {
    let { username, password } = req.query;
}