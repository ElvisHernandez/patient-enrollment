import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PatientWithRAFScore, PatientsApiResponse } from '../../server/types';
import { Alert, AlertMessage } from '../components/alert';
import { Loader } from '../components/loader';

export function Patients() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<Array<PatientWithRAFScore>>([]);
    const [highestSegmentRafScoreData, setHighestSegmentRafScoreData] = useState<{ segmentName: string, rafScore: number } | null>(null);
    const [successMessage, setSuccessMessage] = useState<AlertMessage | null>(null);
    const [errorMessage, setErrorMessage] = useState<AlertMessage | null>(null);

    useEffect(() => {
        fetchPatients();
        const { message } = location?.state || {};

        if (message) {
            setSuccessMessage({
                severity: 'success',
                body: message,
            });
            navigate(location.pathname, { replace: true });
        }
    }, []);

    const fetchPatients = async () => {
        const res = await fetch('http://localhost:3000/api/patients')
            .then((res) => res.json())
            .catch(() => {
                setErrorMessage({
                    severity: 'danger',
                    body: 'Apologies, seems there was an error. Please try refreshing the page.',
                });
                return { patients: [] };
            }) as PatientsApiResponse;

        setPatients(res?.patients || []);

        if (res.highestSegmentNameRafScore && res.segmentNameWithHighestRafScore) {
            setHighestSegmentRafScoreData({
                segmentName: res.segmentNameWithHighestRafScore,
                rafScore: res.highestSegmentNameRafScore,
            });
        }
        setLoading(false);
    }

    return (
        <div>
            {!!successMessage && (
                <Alert message={successMessage} messageSetter={setSuccessMessage} />
            )}

            {!!errorMessage && (
                <Alert message={errorMessage} messageSetter={setErrorMessage} />
            )}

            <div className="d-flex justify-content-end">
                <Link to="/add-patient" className="btn btn-primary">Add Patient</Link>
            </div>

            <h1 className="text-center">Patients</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Enrollment Status</th>
                        <th scope="col">RAF Score</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.name}</td>
                            <td>{patient.enrollmentStatus}</td>
                            <td>{patient.rafScore ? patient.rafScore : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {!!highestSegmentRafScoreData && (
                <p className="text-center">The highest RAF Segment is <b>{highestSegmentRafScoreData.segmentName}</b> with a score of <b>{highestSegmentRafScoreData.rafScore}</b></p>
            )}

            {loading && (
                <div className="d-flex justify-content-center mt-3">
                    <Loader />
                </div>
            )}
        </div>
    )
}
