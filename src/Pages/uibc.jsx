/** @format */

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import Navbar from "./Navbar";
import useSensitiveContentDetection from "../utils";

const FileUpload = () => {
	const [inputValue, setInputValue] = useState(""); // Input for text content

	// Sensitive content detection hook
	const { isLoading, result, error, checkSensitiveContent } =
		useSensitiveContentDetection("AIzaSyB2gRtfJY8cnKd8lxjsYE4oE-ag239HIDQ"); // Replace with your actual API key

	// Handle text input change
	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (inputValue.trim()) {
			console.log("Text Content Submitted:", inputValue);
			await checkSensitiveContent(inputValue); // Analyze the text content
		} else {
			alert("Please provide the required input!");
		}
	};

	return (
		<>
			<Navbar />
			<div className='min-h-screen bg-[#f9f9f9] p-6 flex'>
				{/* Main Layout */}
				<div className='flex flex-1 gap-4'>
					{/* Left Column */}
					<div className='flex flex-col flex-1'>
						{/* Upload Section */}
						<Card className='p-6 flex-1 bg-white shadow-lg rounded-lg'>
							<h1 className='text-2xl font-bold mb-6 text-[#f15656]'>
								Enter Text for Analysis
							</h1>

							{/* Text Input */}
							<div className='mb-4'>
								<label className='block text-sm font-medium text-black mb-2'>
									Enter Text
								</label>
								<Textarea
									rows={4}
									placeholder='Write your content here...'
									value={inputValue}
									onChange={handleInputChange}
									className='p-2 border border-gray-300 rounded w-full'
								/>
							</div>

							{/* Submit Button */}
							<Button
								onClick={handleSubmit}
								className='mt-4 bg-[#f15656] text-white hover:bg-[#d14e4e] w-full py-2 rounded'>
								{isLoading ? "Analyzing..." : "Submit"}
							</Button>
						</Card>

						{/* Preview Section */}
						<Card className='p-6 flex-1 mt-4 bg-white shadow-lg rounded-lg'>
							<h2 className='text-xl font-bold mb-4 text-[#f15656]'>Preview</h2>
							{inputValue && (
								<div className='bg-[#f9f9f9] p-4 rounded shadow'>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{inputValue}
									</p>
								</div>
							)}
							{!inputValue && (
								<p className='text-gray-500'>
									Your entered content will appear here.
								</p>
							)}

							{/* Publish Button */}
							{inputValue && (
								<Button
									onClick={() => alert("Post Published!")}
									className='mt-4 bg-[#f15656] text-white hover:bg-[#d14e4e] w-full py-2 rounded'>
									Publish
								</Button>
							)}
						</Card>
					</div>

					{/* Right Column - Analysis Results */}
					<Card className='p-6 flex-1 bg-white shadow-lg rounded-lg'>
						<h2 className='text-xl font-bold mb-4 text-[#f15656]'>
							Analysis Results
						</h2>
						{isLoading && (
							<p className='text-[#f15656]'>Analyzing content...</p>
						)}
						{error && (
							<p className='text-red-500'>
								Sensitive Content Detected:{" "}
								{error.includes("SAFETY") ? "Safety Violation" : error}
							</p>
						)}
						{result && (
							<div className='text-gray-700 bg-[#f9f9f9] p-4 rounded shadow'>
								<h3 className='font-bold'>Analysis Summary:</h3>
								<p className='whitespace-pre-wrap'>{result}</p>
							</div>
						)}
						{!isLoading && !result && !error && (
							<p className='text-gray-500'>Analysis result will appear here.</p>
						)}
					</Card>
				</div>
			</div>
		</>
	);
};

export default FileUpload;
