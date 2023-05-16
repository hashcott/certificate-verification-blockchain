import Head from "next/head";

import { Container } from "../components/Container";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
	return (
		<>
			<Head>
				<title>BlockCert</title>
				<meta name="description" content="Welcome to BlockCert" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<div className="h-screen flex flex-col items-center justify-center">
					<h1 className="-mt-28 text-6xl font-bold font-geomanist font-mono pb-12">
						certs.io
					</h1>
					<div className="form-control">
						<div className="input-group">
							<input
								type="text"
								placeholder="Search…"
								className="input input-bordered pr-40"
							/>
							<button className="btn btn-square btn-primary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};

export default Index;
