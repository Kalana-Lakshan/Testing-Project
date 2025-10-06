import type { Request, Response } from "express";
import { createBranch, getAllBranches, getBranchCount, getBranchesForPagination, updateBranch, type Branch } from "../models/branch.model.ts";

export const createNewBranch = async (req: Request, res: Response) => {
  let { name, location, landline_no } = req.body;
  try {
    await createBranch(
      name,
      location,
      landline_no,
    );
  } catch (error) {
    console.error("Error in createNewBranch handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    let branches: Branch[];
    if (!count || !offset) {
      branches = await getAllBranches();
    } else {
      branches = await getBranchesForPagination(Number(count), Number(offset));
    }
    if (branches.length < 1) {
      res.status(404).json({ error: "Branches not found" });
    }
    const branch_count: Number = await getBranchCount();
    if (branch_count == undefined) {
      console.log("error in finding the branch count, count = " + branch_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      branch_count: branch_count,
      branches: branches
    });
  } catch (error) {
    console.log("error in getBranches handler: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  };
};

export const updateBranchByID = async (req: Request, res: Response) => {
  const { branch_name, location, landline_no } = req.body;
  const { id } = req.params;
  try {
    await updateBranch(Number(id), branch_name, location, landline_no);
    return res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Error in updateBranchByID handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};