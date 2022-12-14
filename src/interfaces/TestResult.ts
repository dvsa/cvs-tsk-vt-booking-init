// From test-result lambda https://github.com/dvsa/cvs-svc-test-results/blob/develop/src/models/ITestResult.ts

export interface TestResult {
  testResultId: string;
  systemNumber: string;
  testerStaffId: string;
  testStartTimestamp: string | Date;
  odometerReadingUnits: string;
  testEndTimestamp: string | Date;
  testStatus: string;
  testTypes: TestType[];
  vehicleClass: VehicleClass;
  vehicleSubclass?: string[];
  vin: string;
  vehicleSize?: string; // Mandatory for PSV only & not applicable to HGV and TRL
  testStationName: string;
  vehicleId?: string; // Not sent from FE, calculated in the BE. When the test result is submitted, in BE, the VRM of the vehicle will be copied into  vehicleId also.
  vehicleType: string;
  countryOfRegistration: string;
  preparerId: string;
  preparerName: string;
  odometerReading: number;
  vehicleConfiguration: string;
  testStationType: string;
  reasonForCancellation: string | null;
  testerName: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL
  testStationPNumber: string;
  numberOfSeats?: number; // mandatory for PSV only, not applicable for HGV and TRL
  noOfAxles: number;
  numberOfWheelsDriven?: number;
  testerEmailAddress: string;
  euVehicleCategory: string;
  deletionFlag: boolean | null; // Not sent from FE, calculated in the BE.
  regnDate?: string | Date; // Used only for PSV and HGV
  trailerId?: string; // Mandatory for TRL, not applicable to PSV and HGV
  firstUseDate?: string | Date; // Used only for TRL
  testVersion?: string;
  reasonForCreation?: string;
  createdByName?: string;
  createdById?: string;
  createdAt?: string;
  lastUpdatedByName?: string;
  lastUpdatedById?: string;
  lastUpdatedAt?: string;
  shouldEmailCertificate?: string;
  testHistory?: TestResult[];
}

export interface TestType {
  prohibitionIssued: boolean;
  testCode?: string; // Not sent from FE, calculated in the BE.
  testNumber: string | null; // Not sent from FE, calculated in the BE.
  lastUpdatedAt: string | Date;
  testAnniversaryDate: string | Date | null; // Not sent from FE, calculated in the BE.
  additionalCommentsForAbandon: string | null;
  numberOfSeatbeltsFitted?: number | null; // mandatory for PSV only, not applicable for HGV and TRL
  testTypeEndTimestamp: string | Date;
  reasonForAbandoning: string | null;
  lastSeatbeltInstallationCheckDate?: string | Date | null; // mandatory for PSV only, not applicable for HGV and TRL
  createdAt: string | Date | null;
  testTypeId: string;
  testTypeStartTimestamp: string | Date;
  testTypeName: string;
  seatbeltInstallationCheckDate?: boolean | null; // mandatory for PSV only, not applicable for HGV and TRL
  additionalNotesRecorded: string;
  defects: Defect[];
  name: string;
  certificateLink?: string | null; // Not sent from FE, calculated in the BE.
  testTypeClassification?: string; // field not present in API specs and is removed during POST but present in all json objects
  testResult: string;
  certificateNumber?: string | null;
  testExpiryDate?: string | Date; // Sent form FE only for LEC tests. For the rest of the test types it is not sent from FE, and calculated in the BE.
  deletionFlag?: boolean | null; // Not sent from FE, calculated in the BE.

  // Used only for LEC tests.
  modType?: ModType | null;
  particulateTrapSerialNumber?: string | null;
  smokeTestKLimitApplied?: string | null;
  emissionStandard?: string | null;
  modificationTypeUsed?: string | null;
  particulateTrapFitted?: string | null;
  fuelType?: string | null;
}

export interface Defect {
  deficiencyCategory: string;
  deficiencyText: string | null;
  prs: boolean | null;
  additionalInformation: AdditionalInformation;
  itemNumber: number;
  deficiencyRef: string;
  stdForProhibition: boolean | null;
  deficiencySubId: string | null;
  imDescription: string;
  deficiencyId: string;
  itemDescription: string;
  imNumber: number;
  prohibitionIssued?: boolean;
}

export interface AdditionalInformation {
  location: Location | null;
  notes: string;
}

export interface Location {
  axleNumber: number | null;
  horizontal: string | null;
  vertical: string | null;
  longitudinal: string | null;
  rowNumber: number | null;
  lateral: string | null;
  seatNumber: number | null;
}

export interface VehicleClass {
  code: string;
  description: string;
}

export interface ModType {
  code: string;
  description: string;
}
