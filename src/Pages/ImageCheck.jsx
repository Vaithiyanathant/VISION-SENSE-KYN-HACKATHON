/** @format */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { db } from "../../firebase"; // Import the Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import Navbar from "./Navbar";

const loadImageBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

const ImageCheck = () => {
	const [file, setFile] = useState(null); // Uploaded media file
	const [filePreview, setFilePreview] = useState(null); // File preview URL
	const [boundingBoxes, setBoundingBoxes] = useState([]); // Bounding box data
	const [imageDimensions, setImageDimensions] = useState({
		width: 0,
		height: 0,
	}); // Image dimensions
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [bloodDetectionResults, setBloodDetectionResults] = useState([]);
	const [report, setReport] = useState(null); // Report state

	const canvasRef = useRef(null);

	// Handle file input change
	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			setFilePreview(URL.createObjectURL(selectedFile));
			setBoundingBoxes([]); // Reset bounding boxes for a new file
			setReport(null); // Reset report for a new file
		}
	};

	// API Calls
	const checkSensitiveMedia = useCallback(async (base64) => {
		try {
			const response = await axios.post(
				"https://detect.roboflow.com/explicit/1",
				base64,
				{
					params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				}
			);
			return response.data;
		} catch (err) {
			console.error("Error in nudity detection:", err.message);
			return null;
		}
	}, []);

	const checkDeepFake = useCallback(async (base64) => {
		try {
			const response = await axios.post(
				"https://classify.roboflow.com/deep-fake-detection-xxa8f/1",
				base64,
				{
					params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				}
			);
			return response.data;
		} catch (err) {
			console.error("Error in deep fake detection:", err.message);
			return null;
		}
	}, []);

	const checkBloodDetection = useCallback(async (base64) => {
		try {
			const response = await axios.post(
				"https://detect.roboflow.com/sensitive-content-2-1vqje/1",
				base64,
				{
					params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				}
			);
			return response.data;
		} catch (err) {
			console.error("Error in blood detection:", err.message);
			return null;
		}
	}, []);

	const handleSubmit = async () => {
		if (!file) {
			alert("Please upload an image file!");
			return;
		}

		try {
			const base64 = await loadImageBase64(file);

			setIsLoading(true);
			setError(null);

			const [nudityResult, deepFakeResult, bloodResult] = await Promise.all([
				checkSensitiveMedia(base64),
				checkDeepFake(base64),
				checkBloodDetection(base64),
			]);

			// Create the report
			const nudityDetected = nudityResult?.predictions?.length || 0;
			const deepFakeDetected =
				deepFakeResult?.predictions?.Fake?.confidence >= 0.7;
			const bloodDetected = bloodResult?.predictions?.length || 0;

			const summary = `Analysis complete. Detected ${nudityDetected} instances of nudity, ${
				deepFakeDetected ? "a deep fake" : "no deep fake content"
			}, and ${bloodDetected} instances of blood or injuries.`;

			const reportData = {
				nudityDetected,
				deepFakeDetected,
				bloodDetected,
				summary,
				nudityDetails: nudityResult?.predictions || [],
				bloodDetails: bloodResult?.predictions || [],
				timestamp: new Date().toISOString(),
			};

			setReport(reportData); // Save report data
			setBoundingBoxes(nudityResult?.predictions || []);
			setBloodDetectionResults(bloodResult?.predictions || []);

			// Store the report in Firestore
			const reportsCollection = collection(db, "imageReports");
			await addDoc(reportsCollection, reportData);

			console.log("Report saved to Firestore.");
		} catch (err) {
			console.error("Error during analysis:", err.message);
			setError(`Error during analysis: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (filePreview && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const img = new Image();
			img.src = filePreview;

			img.onload = () => {
				// Set canvas dimensions to match the image
				canvas.width = img.width;
				canvas.height = img.height;
				setImageDimensions({ width: img.width, height: img.height });

				// Clear and draw the image as the base layer
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, img.width, img.height);

				// Draw bounding boxes
				boundingBoxes.forEach((box) => {
					const { x, y, width, height, class: className, confidence } = box;
					const topLeftX = x - width / 2;
					const topLeftY = y - height / 2;
					ctx.strokeStyle = "yellow";
					ctx.lineWidth = 2;
					ctx.strokeRect(topLeftX, topLeftY, width, height);
					ctx.font = "16px Arial";
					ctx.fillStyle = "yellow";
					ctx.fillText(
						`${className} (${(confidence * 100).toFixed(1)}%)`,
						topLeftX,
						topLeftY - 10
					);
				});

				bloodDetectionResults.forEach((prediction) => {
					const {
						x,
						y,
						width,
						height,
						confidence,
						class: className,
					} = prediction;
					const topLeftX = x - width / 2;
					const topLeftY = y - height / 2;
					ctx.strokeStyle = "red";
					ctx.lineWidth = 2;
					ctx.strokeRect(topLeftX, topLeftY, width, height);
					ctx.font = "16px Arial";
					ctx.fillStyle = "red";
					ctx.fillText(
						`${className} (${(confidence * 100).toFixed(1)}%)`,
						topLeftX,
						topLeftY - 10
					);
				});
			};

			img.onerror = () => {
				console.error("Failed to load image");
			};
		}
	}, [filePreview, boundingBoxes, bloodDetectionResults]);

	return (
		<>
			<Navbar />

			<div className='flex flex-row min-h-screen bg-gray-100 p-6 gap-4'>
				{/* Left Column */}
				<div className='w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg'>
					<h2 className='text-xl font-semibold mb-4 text-black'>
						Upload Section
					</h2>
					<p className='text-gray-700 mb-4'>
						Upload your image and preview the post.
					</p>

					<div className='flex flex-col w-full max-w-lg mx-auto'>
						<h1 className='text-2xl font-bold mb-6 text-black'>Upload Image</h1>

						{/* Upload Image Button */}
						<div className='flex flex-col items-center justify-center bg-[#ffffff] p-6 rounded-lg shadow-lg'>
							{/* Upload Label */}
							<label
								htmlFor='file-upload'
								className='custum-file-upload flex flex-col items-center justify-center h-48 w-72 cursor-pointer border-2 border-dashed border-gray-300 bg-[#ffffff] rounded-lg shadow-md hover:border-[#f15656] hover:bg-[#f9f9f9] transition'>
								<div className='icon flex items-center justify-center'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='currentColor'
										viewBox='0 0 24 24'
										className='h-16 w-16 text-gray-500'>
										<path
											fillRule='evenodd'
											d='M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z'
											clipRule='evenodd'
										/>
									</svg>
								</div>
								<div className='text flex items-center justify-center'>
									<span className='text-gray-600'>Click to upload image</span>
								</div>
								<input
									type='file'
									id='file-upload'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
								/>
							</label>

							{/* Submit Button */}
							<button
								onClick={handleSubmit}
								className='mt-6 bg-[#f15656] text-white py-2 px-6 rounded hover:bg-[#d14e4e] transition-all w-64'
								disabled={isLoading}>
								{isLoading ? "Analyzing..." : "Submit"}
							</button>
						</div>

						{/* Post Preview */}
						<div className='flex flex-col items-center justify-center bg-[#ffffff] p-6 rounded-lg shadow-lg w-full max-w-sm mt-6 mx-auto'>
							<h2 className='text-xl font-semibold mb-4 text-black'>
								Post Preview
							</h2>
							{file ? (
								<div className='w-full h-64 border rounded shadow overflow-hidden'>
									<img
										src={URL.createObjectURL(file)}
										alt='Uploaded Post'
										className='object-cover w-full h-full'
									/>
								</div>
							) : (
								<p className='text-gray-500 text-center'>No image selected.</p>
							)}
							<button
								className='mt-4 bg-[#f15656] text-white py-2 px-6 rounded hover:bg-[#d14e4e] w-full transition'
								onClick={() => alert("Post Published!")}>
								Publish
							</button>
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className='w-full md:w-2/3 grid grid-cols-2 gap-4'>
					{/* Section 2 */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4'>Section 2</h2>
						<p>This section shows the uploaded image preview.</p>
						{file ? (
							<div className='w-full h-ful border rounded shadow overflow-hidden'>
								<img
									src={URL.createObjectURL(file)}
									alt='Uploaded Image'
									className='object-cover w-full h-full'
								/>
							</div>
						) : (
							<p className='text-gray-500 text-center'>No image selected.</p>
						)}
					</div>

					{/* Section 3 */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4'>Section 3</h2>
						<p>This section displays a canvas for analysis.</p>
						{filePreview ? (
							<div className='w-full h-ful border rounded shadow overflow-hidden'>
								<canvas
									ref={canvasRef}
									className='w-full h-full'></canvas>
							</div>
						) : (
							<p className='text-gray-500 text-center'>No image selected.</p>
						)}
					</div>

					{/* Section 4 */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4'>Analysis Summary</h2>
						<p>
							This section displays the analysis summary of the uploaded image.
						</p>
						{report && (
							<div className='mt-6 bg-white p-6 rounded-lg shadow-lg'>
								<h2 className='text-lg font-semibold mb-4'>
									Analysis Summary:
								</h2>
								<p className='bg-gray-100 p-4 rounded'>{report.summary}</p>
							</div>
						)}
					</div>

					{/* Section 5 */}
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4'>Detailed Report</h2>
						<p>This section provides the detailed report of the analysis.</p>
						{report && (
							<div className='mt-6 bg-white p-6 rounded-lg shadow-lg'>
								<h2 className='text-lg font-semibold mb-4'>Detailed Report:</h2>
								<pre className='bg-gray-100 p-4 rounded'>
									{JSON.stringify(report, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ImageCheck;
