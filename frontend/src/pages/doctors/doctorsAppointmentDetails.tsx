import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import { doctorAppointmentService } from '@/services/doctorappointmentservice';
import type { DoctorAppointment } from '@/types/doctor.appointments.types';

export default function DoctorsAppointmentDetails() {
  // State variables - like boxes that hold our data
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);  // Array of doctor appointments
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // useEffect runs when component first loads (mounts)
  useEffect(() => {
    // Function to fetch doctors data
    const fetchDoctorAppointments = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors

        // Call our service to get doctor appointments
        const appointmentsData = await doctorAppointmentService.getAllDoctorAppointments();

        // Update state with the fetched data
        setAppointments(appointmentsData);
        
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
    fetchDoctorAppointments();
  }, []);  // Empty array means "run once when component mounts"

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="DoctorAppointments' Details" />
        <div>Loading doctor appointments data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="DoctorAppointments' Details" />
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
      <PageTitle title="DoctorAppointments' Details" />
      
      <div>
        <h2>All Doctor Appointments ({appointments.length})</h2>

        {appointments.length === 0 ? (
          <p>No doctor appointments found in database.</p>
        ) : (
          <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Appointment_ID</th>
                <th>Patient_ID</th>
                <th>Doctor_ID</th>
                <th>Patient_Note</th>
                <th>Date</th>
                <th>Time_Slot</th>
                <th>Status</th>
                <th>Time_Stamp</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointment_id}>
                    <td>{appointment.appointment_id}</td>
                    <td>{appointment.patient_id}</td>
                    <td>{appointment.doctor_id}</td>
                    <td>{appointment.patient_note}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time_slot}</td>
                    <td>{appointment.status}</td>
                    <td>{appointment.time_stamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}