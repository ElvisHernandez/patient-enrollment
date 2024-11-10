import { patients, patientRiskProfiles } from "./fakeDatabaseData";
import type { Patient, PatientRiskProfile, PatientWithRAFScore } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPatients() {
  await delay(500);
  return patients;
}

export async function getRiskProfilesByPatientId() {
  await delay(500);

  const riskProfilesByPatientId = patientRiskProfiles.reduce((acc, riskProfile) => {
    if (!acc[riskProfile.patientId]) {
      acc[riskProfile.patientId] = [];
    }

    acc[riskProfile.patientId].push(riskProfile);

    return acc;
  }, {} as Record<number, Array<PatientRiskProfile>>);

  return riskProfilesByPatientId;
}

export async function getRiskProfilesBySegmentName() {
  await delay(500);

  const riskProfilesBySegmentName = patientRiskProfiles.reduce((acc, riskProfile) => {
    if (!acc[riskProfile.segmentName]) {
      acc[riskProfile.segmentName] = [];
    }

    acc[riskProfile.segmentName].push(riskProfile);

    return acc;
  }, {} as Record<string, Array<PatientRiskProfile>>);

  return riskProfilesBySegmentName;
}

export function calculateRAFScore(riskProfiles: Array<PatientRiskProfile>) {
  let rafScore = 0;

  for (const riskProfile of riskProfiles) {
    const demographicCoefficients = riskProfile.demographicCoefficients?.reduce((acc, c) => acc + c, 0) || 0;
    const diagnosisCoefficients = riskProfile.diagnosisCoefficients?.reduce((acc, c) => acc + c, 0) || 0;
    rafScore += demographicCoefficients + diagnosisCoefficients;
  }

  return Number(rafScore.toFixed(2));
}

export function getPatientRAFScore(
  patient: Patient,
  riskProfilesByPatientId: Record<string, Array<PatientRiskProfile>>
): PatientWithRAFScore {
  if (!riskProfilesByPatientId[patient.id]) return patient;

  const rafScore = calculateRAFScore(riskProfilesByPatientId[patient.id]);

  return {
    ...patient,
    rafScore
  }
}

function calculateRAFScoreBySegmentName(
  riskProfilesBySegmentName: Record<string, Array<PatientRiskProfile>>
): Record<string, number> {

  const rafScoresBySegmentName = Object.entries(riskProfilesBySegmentName)
    .reduce((acc, [segmentName, riskProfiles]) => {
      const segmentRafScore = calculateRAFScore(riskProfiles);
      acc[segmentName] = segmentRafScore;

      return acc;
    }, {} as Record<string, number>);

  return rafScoresBySegmentName;
}

export function getHighestSegmentNameRAFScore(
  riskProfilesBySegmentName: Record<string, Array<PatientRiskProfile>>
): [segmentName: string, rafScore: number] {

  const rafScoresBySegmentName = calculateRAFScoreBySegmentName(riskProfilesBySegmentName);

  const sortedRafScoresBySegmentName = Object.entries(rafScoresBySegmentName)
    .sort(
      ([_, rafScoreA], [__, rafScoreB]) => rafScoreB - rafScoreA
    );

  return sortedRafScoresBySegmentName[0];
}

