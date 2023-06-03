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
	displayName: string;
	image: string;
	role: Role;
	position: Position;
	accountStatus: AccountStatus;
	certification: Certification;
}
export enum CertificationStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	BANNED = "banned",
}

export enum DegreeClassfication {
	EXCELLENT = "excellent",
	GOOD = "good",
}

export interface Certification {
	organizationName: string;
	academicYear: string;
	degreeClassfication: DegreeClassfication;
	certificationStatus: CertificationStatus;
	isVerifiedByKHOA: boolean;
	isVerifiedByDAOTAO: boolean;
	isVerifiedByTAIVU: boolean;
	isVerifiedByHT: boolean;
	isVerifiedByTHUVIEN: boolean;
	isVerifiedByKTX: boolean;
}

export interface Room {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	description: string;
	is: boolean;
	users: User[];
	mods: User[];
	owner: User;
	messages: Message[];
	invitations: Invitation[];
}

export interface Message {
	id: string;
	createdAt: string;
	updatedAt: string;
	text: string;
	edited: boolean;
	author: {
		id: string;
		displayName: string;
	};
	room: {
		id: string;
		name: string;
	};
}

export interface Invitation {
	id: string;
	createdAt: string;
	updatedAt: string;
}
