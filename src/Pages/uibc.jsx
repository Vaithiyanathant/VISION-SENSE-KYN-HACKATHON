/** @format */

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import useSensitiveContentDetection from "../utils";
import Navbar from "./Navbar";

const FileUpload = () => {
	const [selectedType, setSelectedType] = useState("Text"); // Default type is Text
	const [inputValue, setInputValue] = useState(""); // Input for text content
	const [file, setFile] = useState(null); // Uploaded media file
	const [filePreview, setFilePreview] = useState(null); // File preview URL

	// Sensitive content detection hook
	const {
		isLoading,
		result,
		error,
		checkSensitiveContent,
		checkSensitiveMedia,
	} = useSensitiveContentDetection(
		"AIzaSyB2gRtfJY8cnKd8lxjsYE4oE-ag239HIDQ" // Replace with your actual API key
	);

	// Handle file input change
	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			setFilePreview(URL.createObjectURL(selectedFile));
		}
	};

	// Handle text input change
	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (selectedType === "Text" && inputValue.trim()) {
			console.log("Text Content Submitted:", inputValue);
			await checkSensitiveContent(inputValue); // Analyze the text content
		} else if ((selectedType === "Image" || selectedType === "Video") && file) {
			console.log("Media Uploaded:", file.name);
			await checkSensitiveMedia(file, selectedType.toLowerCase()); // Analyze the media content
		} else {
			alert("Please provide the required input!");
		}
	};

	return (
		<>
			<Navbar></Navbar>
			<div className='min-h-screen bg-gray-50 p-6 flex'>
				{/* Main Layout */}
				<div className='flex flex-1 gap-4'>
					{/* Left Column */}
					<div className='flex flex-col flex-1'>
						{/* Top Section - Upload Content */}
						<Card className='p-6 flex-1'>
							<h1 className='text-2xl font-bold mb-6'>Upload Content</h1>

							{/* File Type Dropdown */}
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Select Content Type
								</label>
								<select
									value={selectedType}
									onChange={(e) => {
										setSelectedType(e.target.value);
										setFile(null);
										setFilePreview(null);
									}}
									className='w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'>
									<option value='Text'>Text</option>
									<option value='Image'>Image</option>
									<option value='Video'>Video</option>
								</select>
							</div>

							{/* Conditional Input Rendering */}
							{selectedType === "Text" && (
								<div className='mb-4'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Enter Text
									</label>
									<Textarea
										rows={4}
										placeholder='Write your content here...'
										value={inputValue}
										onChange={handleInputChange}
									/>
								</div>
							)}

							{(selectedType === "Image" || selectedType === "Video") && (
								<div className='mb-4'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Upload {selectedType}
									</label>
									<Input
										type='file'
										accept={selectedType === "Image" ? "image/*" : "video/*"}
										onChange={handleFileChange}
									/>
								</div>
							)}

							{/* Submit Button */}
							<Button
								onClick={handleSubmit}
								className='mt-4 bg-blue-600 text-white'
								disabled={isLoading}>
								{isLoading ? "Analyzing..." : "Submit"}
							</Button>
						</Card>

						{/* Bottom Section - Preview */}
						<Card className='p-6 flex-1 mt-4'>
							<h2 className='text-xl font-bold mb-4'>Preview</h2>
							{selectedType === "Text" && (
								<p className='text-gray-700 whitespace-pre-wrap'>
									{inputValue}
								</p>
							)}
							{selectedType === "Image" && filePreview && (
								<img
									src={filePreview}
									alt='Uploaded Preview'
									className='max-w-full h-auto'
								/>
							)}
							{selectedType === "Video" && filePreview && (
								<video
									controls
									className='max-w-full'>
									<source
										src={filePreview}
										type={file?.type}
									/>
									Your browser does not support the video tag.
								</video>
							)}
							{!inputValue && !filePreview && (
								<p className='text-gray-500'>
									Your uploaded content will appear here.
								</p>
							)}
						</Card>
					</div>

					{/* Right Column - Flagged Reasons */}
					<Card className='p-6 flex-1'>
						<h2 className='text-xl font-bold mb-4'>Flagged Reasons</h2>
						{isLoading && <p className='text-blue-500'>Analyzing content...</p>}
						{error && <p className='text-red-500'>{error}</p>}
						{result && (
							<pre className='text-gray-700'>
								{JSON.stringify(result, null, 2)}
							</pre>
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
