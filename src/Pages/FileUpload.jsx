/** @format */

import React, { useState } from "react";
import FileTypeDropdown from "./FileTypeDropdown";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";

const FileUpload = () => {
	const [selectedType, setSelectedType] = useState(""); // Selected file type
	const [inputValue, setInputValue] = useState(""); // Input value for text/live stream
	const [file, setFile] = useState(null); // Uploaded file

	// Handle file input change
	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	// Handle text or live stream input change
	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	// Handle form submission
	const handleSubmit = () => {
		if (selectedType === "Text" || selectedType === "Live Streaming") {
			console.log("Input Value:", inputValue);
		} else if (file) {
			console.log("Uploaded File:", file.name);
		} else {
			alert("Please upload a file or provide input!");
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 p-6 relative'>
			{/* Dropdown for File Types */}
			<FileTypeDropdown onTypeSelect={(type) => setSelectedType(type)} />

			{/* Dynamic Input Area */}
			<Card className='p-6 mt-16'>
				<h1 className='text-2xl font-bold mb-6'>Upload Content</h1>

				{/* Conditional Input Rendering */}
				{selectedType === "Image" && (
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Upload Image
						</label>
						<Input
							type='file'
							accept='image/*'
							onChange={handleFileChange}
						/>
					</div>
				)}

				{selectedType === "Video" && (
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Upload Video
						</label>
						<Input
							type='file'
							accept='video/*'
							onChange={handleFileChange}
						/>
					</div>
				)}

				{selectedType === "Text" && (
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Enter Text
						</label>
						<Textarea
							rows={4}
							placeholder='Enter text for moderation...'
							value={inputValue}
							onChange={handleInputChange}
						/>
					</div>
				)}

				{selectedType === "Live Streaming" && (
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Live Streaming URL
						</label>
						<Input
							type='url'
							placeholder='Enter live streaming URL...'
							value={inputValue}
							onChange={handleInputChange}
						/>
					</div>
				)}

				{/* Submit Button */}
				<Button
					onClick={handleSubmit}
					className='mt-4 bg-blue-600 text-white'>
					Submit
				</Button>
			</Card>
		</div>
	);
};

export default FileUpload;
