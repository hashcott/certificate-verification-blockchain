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
					<div className="w-11/12 md:w-8/12 xl:w-1/2 h-auto p-5 rounded-3xl flex flex-col">
						<section className="w-full form-control">
							<div className="w-full input-group">
								<input
									type="text"
									placeholder="Search…"
									className="input input-bordered w-full"
									onClick={() => {
										console.log(
											"-------------------------------------------------dsd"
										);
									}}
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
						</section>
						<section className="w-full h-auto flex-col gap-y-2 bg-white rounded-b-2xl">
							<div className="w-full h-10 flex items-center gap-x-2 hover:bg-slate-400">
								<p className="font-medium text-black text-base px-4">
									Nguyen DUc Hanh
								</p>
							</div>
							<div className="w-full h-10 flex items-center gap-x-2 hover:bg-slate-400">
								<p className="font-medium text-black text-base px-4">
									Nguyen DUc Hanh
								</p>
							</div>
						</section>
					</div>
				</div>
			</Container>
		</>
	);
};

export default Index;
