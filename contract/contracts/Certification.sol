// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

contract Certification {
	struct Certificate {
		string firstName;
		string lastName;
		string studentCode;
		string citizenIdentificationCode;
		string birth;
		string sex;
		string degreeClassification;
		string academicYear;
		address verifiedBy;
	}

	mapping(string => Certificate) private certificates;
	mapping(string => bool) private isCertificateValid;

	function getCertificateFunc(
		string memory certificateId
	) external view returns (Certificate memory) {
		return certificates[certificateId];
	}

	function isCertificateValidFunc(
		string memory certificateId
	) external view returns (bool) {
		return isCertificateValid[certificateId];
	}

	function addCertificate(
		string memory certificateId,
		string memory firstName,
		string memory lastName,
		string memory studentCode,
		string memory citizenIdentificationCode,
		string memory birth,
		string memory sex,
		string memory degreeClassification,
		string memory academicYear
	) external {
		Certificate storage certificate = certificates[certificateId];

		certificate.firstName = firstName;

		certificate.lastName = lastName;

		certificate.studentCode = studentCode;

		certificate.citizenIdentificationCode = citizenIdentificationCode;

		certificate.birth = birth;

		certificate.sex = sex;

		certificate.degreeClassification = degreeClassification;

		certificate.academicYear = academicYear;

		certificate.verifiedBy = msg.sender;

		isCertificateValid[certificateId] = true;
	}
}
