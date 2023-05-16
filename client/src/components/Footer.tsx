import { Container } from "./Container";

export const Footer = () => {
	return (
		<footer className="md:container md:mx-auto">
			<hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
			<div className="items-center grid-flow-col">
				<p className="py-1">
					<span className="font-bold">CertChain</span> is an
					electronic certificate verification platform based on
					blockchain technology. Its name is a combination of "cert"
					(certificate) and "chain" (blockchain), providing users with
					a way to prove their skills and achievements through
					electronic certificates stored on the blockchain.
				</p>

				<p className="py-2 text-center">© 2023 by Hanh Nguyen</p>
			</div>
		</footer>
	);
};
