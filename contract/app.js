const Queue = require("bull");
const Certification = artifacts.require("Certification");

const addCertificationQueue = new Queue("ADDCERT", {
	redis: { port: 6379, host: "127.0.0.1" },
});

module.exports = async function () {
	const certification = await Certification.new();

	await certification.addCertificate(
		"sfsf",
		"Fsfsfs",
		"fsfsfs",
		"sfsfsfsf",
		"sfsfsfsf",
		"sfsfsfsfsf",
		"sfsfsfsfs",
		"Fsfsfsfsf",
		"34454"
	);

	const data = await certification.getCertificateFunc("sfsf");
	console.log(data);
};
