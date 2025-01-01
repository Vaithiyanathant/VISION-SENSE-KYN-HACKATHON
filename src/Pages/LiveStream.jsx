/** @format */

import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Loader from "./Loader";

const LiveStream = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [streamUrl, setStreamUrl] = useState("");
	const [analysisResult, setAnalysisResult] = useState(null);
	const [error, setError] = useState(null);

	const videoRef = useRef(null);

	const handleStreamUrlChange = (event) => {
		setStreamUrl(event.target.value);
	};

	const analyzeLiveStream = useCallback(async () => {
		if (!streamUrl) {
			alert("Please provide a valid stream URL!");
			return;
		}

		setIsProcessing(true);
		setError(null);
		setAnalysisResult(null);

		try {
			// Replace this with your actual API endpoint for live stream analysis
			const response = await axios.post("https://example.com/analyze-stream", {
				url: streamUrl,
			});

			setAnalysisResult(response.data);
		} catch (err) {
			setError(`Error during live stream analysis: ${err.message}`);
		} finally {
			setIsProcessing(false);
		}
	}, [streamUrl]);

	return (
		<>
			<Navbar />
			<div className='flex flex-row min-h-screen bg-[#f9f9f9] p-6 gap-4'>
				{/* Left Column */}
				<div className='w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg'>
					<h2 className='text-xl font-semibold mb-4 text-black'>
						Live Stream Section
					</h2>
					<p className='text-gray-700 mb-4'>
						Enter the live stream URL to analyze its content.
					</p>

					<div className='bg-[#f9f9f9] p-6 flex flex-col items-center rounded-lg shadow'>
						<h1 className='text-2xl font-bold mb-6 text-black'>
							Analyze Live Stream
						</h1>

						{/* Stream URL Input */}
						<div className='mb-4 w-full'>
							<input
								type='text'
								placeholder='Enter live stream URL...'
								value={streamUrl}
								onChange={handleStreamUrlChange}
								className='p-2 border border-[#f15656] rounded w-full'
							/>
						</div>

						{/* Analyze Button */}
						<button
							onClick={analyzeLiveStream}
							className='mt-4 bg-[#f15656] text-white py-2 px-6 rounded hover:bg-[#d14e4e] transition-all w-full'>
							{isProcessing ? "Analyzing..." : "Analyze"}
						</button>
					</div>
				</div>

				{/* Right Column */}
				<div className='w-full md:w-2/3 grid grid-cols-1 gap-4'>
					{/* Stream Preview */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4 text-black'>
							Live Stream Preview
						</h2>
						{streamUrl ? (
							<video
								ref={videoRef}
								src={streamUrl}
								controls
								className='w-full h-64 object-contain rounded shadow'
							/>
						) : (
							<p className='text-gray-500'>No stream URL provided.</p>
						)}
					</div>

					{/* Analysis Results */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4 text-black'>
							Analysis Results
						</h2>
						{isProcessing && (
							<div className='flex justify-center items-center mt-6'>
								<Loader />
							</div>
						)}
						{error && <p className='text-red-500'>{error}</p>}
						{analysisResult && (
							<div className='mt-6 w-full'>
								<h2 className='text-lg font-semibold mb-4 text-black'>
									Live Stream Analysis Summary:
								</h2>
								<pre className='bg-[#f9f9f9] p-4 rounded overflow-auto'>
									{JSON.stringify(analysisResult, null, 2)}
								</pre>
							</div>
						)}
						{!isProcessing && !analysisResult && !error && (
							<p className='text-gray-500'>
								Analysis results will appear here.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default LiveStream;
