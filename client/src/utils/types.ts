export enum AccountStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	BANNED = "banned",
}

export enum Role {
	USER = "user",
	PREMIUM = "premium",
	MODERATOR = "moderator",
	ADMIN = "admin",
}

export enum Position {
	KHOA = "KHOA",
	DAOTAO = "DAOTAO",
	TAIVU = "TAIVU",
	HT = "HT",
	THUVIEN = "THUVIEN",
	KTX = "KTX",
}

export enum Providers {
	Google = "google",
	Facebook = "facebook",
	Local = "local",
}

export interface User {
	id: string;
	createdAt: string;
	updatedAt: string;
	provider: Providers;
	providerId: string | number;
	email: string;
	firstName: string;
	lastName: string;
	image: string;
	role: Role;
	position: Position;
	accountStatus: AccountStatus;
}
export enum CertificationStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	BANNED = "banned",
}

export enum DegreeClassification {
	Excellent = 1,
	Good = 2,
	FairlyGood = 3,
	Average = 4,
}
export interface Certification {
	id: string;
	firstName: string;
	lastName: string;
	studentCode: string;
	citizenIdentificationCode: string;
	birth: string;
	gender: string;
	academicYear: string;
	degreeClassification: DegreeClassification;
	certificationStatus: CertificationStatus;
	isVerifiedByKHOA: boolean;
	isVerifiedByDAOTAO: boolean;
	isVerifiedByTAIVU: boolean;
	isVerifiedByHT: boolean;
	isVerifiedByTHUVIEN: boolean;
	isVerifiedByKTX: boolean;
}
