const Queue = require("bull");
const Certification = artifacts.require("Certification");

const addCertificationQueue = new Queue("cert", {
	redis: { port: 6379, host: "127.0.0.1" },
});

module.exports = async function () {
	const certification = await Certification.deployed();

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
