import { Doctor } from "./Doctor";

export interface IDoctorEventData {
    doctor: Doctor;
}

export enum DoctorEvents {
    DOCTOR_VALIDATED = 'doctor::validated',
}
