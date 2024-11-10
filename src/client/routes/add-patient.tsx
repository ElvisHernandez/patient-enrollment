import React, { FormEvent, useState } from 'react';
import { Alert, AlertMessage } from '../components/alert';
import { EnrollmentStatus } from '../../server/types';
import { enrollmentStatuses } from '../../server/constants';
import { Link, useNavigate } from 'react-router-dom';

export function AddPatient() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>('Prospect');
    const [errorMessage, setErrorMessage] = useState<AlertMessage | null>(null);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !enrollmentStatus) {
            setErrorMessage({
                severity: 'danger',
                body: 'Name and Enrollment Status must be filled out.',
            });
            return;
        }

        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, enrollmentStatus })
        }).catch(() => ({ status: 500 }));

        if (response.status === 200) {
            navigate('/patients', {
                state: {
                    message: `Successfully added patient ${name}`,
                }
            });
        }
        else {
            setErrorMessage({
                severity: 'danger',
                body: 'Apologies, seems there was an error. Please try resubmitting the form.',
            });
        }
    }

    return (
        <div>
            {!!errorMessage && (
                <Alert message={errorMessage} messageSetter={setErrorMessage} />
            )}

            <div className="d-flex justify-content-end">
                <Link to="/patients" className="btn btn-primary">View Patients</Link>
            </div>

            <h1 className="text-center">Add a new patient</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="patientName" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="patientName"
                        aria-describedby="patientNameHelp"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div id="patientNameHelp" className="form-text">The name of the patient you wish to add.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="enrollmentStatus" className="form-label">Enrollment Status</label>
                    <select
                        id="enrollmentStatus"
                        className="form-select"
                        aria-label="Default select example"
                        aria-describedby="enrollmentStatusHelp"
                        value={enrollmentStatus}
                        onChange={(e) => setEnrollmentStatus(e.target.value as EnrollmentStatus)}
                    >
                        {enrollmentStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <div id="enrollmentStatusHelp" className="form-text">The enrollment status of the patient.</div>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!name}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
