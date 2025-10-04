import pool from "../db/db.js";
import type {Request,Response} from 'express';

export const getAllDoctors = async (req:Request, res:Response) =>{
    try{
        const query = `
        SELECT doctor_id,name,fee_per_patient,basic_monthly_salary,gender
        FROM medsync.doctor
        ORDER BY doctor_id ASC;
        `;
        const [rows] = await pool.execute(query);
        res.status(200).json({
            success:true,
            message: 'Doctors fetched successfully',
            data:rows
        });
    }
    catch (error){
        console.error('Database error:',error);
        res.status(500).json({
            success:false,
            message:'Falied to fetch doctors',
            data:[]
        });
    }
};

export const getDoctorByID = async (req:Request,res:Response) =>{
    try{
        const {id} = req.params;
        if (!id || isNaN(Number(id))){
            return res.status(400).json({
                success:false,
                message:"Please provide a valid doctor ID",
                data:null
            });
        }

        const query = `
        SELECT doctor_id,name,fee_per_patient,basic_monthly_salary,gender
        FROM doctor
        WHERE doctor_id = ?;
        `;
        const [rows] = await pool.execute(query, [id]);
        const doctorRows = rows as any[];

        if (doctorRows.length === 0){
            return res.status(404).json({
                success: false,
                message : 'Doctor not found',
                data:null
            });
        }
        res.status(200).json({
            success:true,
            message : 'Doctor found',
            data: doctorRows
        });
    }
    catch (error){
        console.error('Database error:',error);
        res.status(500).json({
            success :false,
            message: 'Failed to fetch doctor',
            data: null
        });
    }
};
