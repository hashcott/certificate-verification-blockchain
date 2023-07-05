require("dotenv").config();
const { REDIS } = process.env;

const Queue = require("bull");
const Certification = artifacts.require("Certification");

const addCertificationQueue = new Queue("cert", {
	redis: { port: 6379, host: REDIS },
});

module.exports = async function () {
	await addCertificationQueue.isReady();
	console.log("Redis connected !");

	const certification = await Certification.deployed();
	console.log("Ready !!!");
	addCertificationQueue.process(async function (job, done) {
		console.log("Starting to save into blockchain");
		const {
			id,
			firstName,
			lastName,
			studentCode,
			citizenIdentificationCode,
			birth,
			gender,
			degreeClassification,
			academicYear,
		} = job.data;
		console.log({
			id,
			firstName,
			lastName,
			studentCode,
			citizenIdentificationCode,
			birth,
			gender,
			degreeClassification,
			academicYear,
		});
		await certification.addCertificate(
			id,
			firstName,
			lastName,
			studentCode,
			citizenIdentificationCode,
			birth,
			gender,
			degreeClassification.toString(),
			academicYear
		);
		console.log("Saved into blockchain");
		done();
	});
};
