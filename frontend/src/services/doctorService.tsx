import type {Doctor,DoctorsApiResponse} from '../types/doctor.types';

const API_BASE_URL = 'http://localhost:8000';

export const doctorService = {
    getAllDoctors: async():Promise<Doctor[]>=>{
        try{
            const response = await fetch(`${API_BASE_URL}/doctors`,{
                method:'GET',
                headers:{
                    'content-Type':'application/json',

                },
            });

            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`);

            }
            const data:DoctorApiResponse = await response.json();

            if(data.success){
                return data.data;
            }else{
                throw new Error(data.message || 'Failed to fetch doctors');
            }
       
        } catch(error){
            console.error('Error in getAllDoctors:',error);
            throw error;
        }
    },
        getDoctorByID:async(id:number): Promise<Doctor>=>{
            try{
                const response = await fetch(`${API_BASE_URL}/doctors/${id}`,{
                    method:'GET',
                    headers:{
                        'content-Type':'application/json',
                    },
                });

                if (!response.ok){
                    throw new Error(`Server responded with status:${response.status}`);
                }
                const data = await response.json();

                if(data.success){
                    return data.data;;
                }else{
                    throw new Error(data.message || 'Failed to fetch doctor');
            
                }
            }catch(error){
                console.error('Error in getDoctorByID:',error);
                throw error;
            }
        },
    };
            