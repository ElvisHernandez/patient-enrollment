import { Router } from "express";
import { enrollmentStatuses } from "./constants";
import { patients } from "./database/fakeDatabaseData";
import { getRiskProfilesByPatientId, getPatients, getRiskProfilesBySegmentName, getHighestSegmentNameRAFScore, getPatientRAFScore } from "./database/helpers";
import { EnrollmentStatus, Patient, PatientsApiResponse } from "./types";

const router = Router();

router.get("/api/patients", async (_, res) => {
  let statusCode = 200;
  let responseBody: PatientsApiResponse = {};

  try {
    const [
      patientsWithoutRAFScore,
      riskProfilesByPatientId,
      riskProfilesBySegmentName,
    ] = await Promise.all([
      getPatients(),
      getRiskProfilesByPatientId(),
      getRiskProfilesBySegmentName(),
    ]);

    const patientsWithRAFScore = patientsWithoutRAFScore.map(
      (patient) => getPatientRAFScore(patient, riskProfilesByPatientId)
    );
    const [segmentName, rafScore] = getHighestSegmentNameRAFScore(riskProfilesBySegmentName);

    responseBody = {
      patients: patientsWithRAFScore,
      segmentNameWithHighestRafScore: segmentName,
      highestSegmentNameRafScore: rafScore,
    };
  }
  catch (e) {
    statusCode = 500;
    console.error(e);
  }

  return res.status(statusCode).json(responseBody);
});

router.post("/api/patients", async (req, res) => {
  const { name, enrollmentStatus } = req.body;

  const response: {
    errors: string[],
    body: Patient | null,
  } = {
    errors: [],
    body: null,
  }
  let statusCode = 200;

  if (!name || typeof name !== 'string') {
    response.errors.push('Name is a required string parameter');
    statusCode = 400;
  }

  if (
    !enrollmentStatus ||
    typeof enrollmentStatus !== 'string' ||
    !enrollmentStatuses.includes(enrollmentStatus as EnrollmentStatus)
  ) {
    response.errors.push('Enrollment status is a required parameter and must be one of the valid types');
    statusCode = 400;
  }

  if (statusCode === 200) {
    const lastPatientId = patients[patients.length - 1]?.id || 999;
    const newPatient = {
      id: lastPatientId + 1,
      name,
      enrollmentStatus,
    }
    patients.push(newPatient);
    response.body = newPatient;
  }

  return res.status(statusCode).json(response);
});

export { router }
