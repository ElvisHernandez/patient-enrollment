import { Router } from "express";
import { getRiskProfilesByPatientId, getPatients, getRiskProfilesBySegmentName, getHighestSegmentNameRAFScore, getPatientRAFScore } from "./database/helpers";
import { PatientsApiResponse } from "./types";

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

export { router }
