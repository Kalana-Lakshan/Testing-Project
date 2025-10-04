import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import { doctorService } from '@/services/doctorService';
import type { Doctor } from '@/types/doctor.types';

export default function DoctorsDetails() {
  // State variables - like boxes that hold our data
  const [doctors, setDoctors] = useState<Doctor[]>([]);  // Array of doctors
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message
  //console.log("RENDERING DOCTORS DETAILS COMPONENT");
  //console.log(doctors);
  // useEffect runs when component first loads (mounts)
  useEffect(() => {
    // Function to fetch doctors data
    const fetchDoctors = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors
        
        // Call our service to get doctors
        const doctorsData = await doctorService.getAllDoctors();
        
        // Update state with the fetched data
        setDoctors(doctorsData);
        
      } catch (err) {
        // Handle any errors
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to fetch doctors:', err);
        
      } finally {
        setLoading(false);  // Hide loading state
      }
    };

    // Actually call the function
    fetchDoctors();
  }, []);  // Empty array means "run once when component mounts"

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="Doctors' Details" />
        <div>Loading doctors data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Doctors' Details" />
        <div style={{ color: 'red' }}>Error: {error}</div>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // Show actual data
  return (
    <div className="space-y-6">
      <PageTitle title="Doctors' Details" />
      
      <div>
        <h2>All Doctors ({doctors.length})</h2>
        
        {doctors.length === 0 ? (
          <p>No doctors found in the database.</p>
        ) : (
          <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Fee per Patient</th>
                <th>Monthly Salary</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctor_id}>
                  <td>{doctor.doctor_id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.gender}</td>
                  <td>Rs.{doctor.fee_per_patient}</td>
                  <td>Rs.{doctor.basic_monthly_salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}