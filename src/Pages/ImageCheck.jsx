/** @format */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";

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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 }); // Image dimensions
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bloodDetectionResults, setBloodDetectionResults] = useState([]); // New state for the third API

  const canvasRef = useRef(null);

  // Handle file input change
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setBoundingBoxes([]); // Reset bounding boxes for a new file
    }
  };

  // Analyze the uploaded media using the nudity detection API
  const checkSensitiveMedia = useCallback(async (base64) => {
	console.log(1);
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
  

  // Add a third API function for blood, dead bodies, organs, and severe injuries detection
  const checkBloodDetection = useCallback(async (base64) => {
	console.log(3);
	try {
	  const response = await axios.post(
		"https://detect.roboflow.com/sensitive-content-2-1vqje/1",
		base64,
		{
		  params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
		  headers: { "Content-Type": "application/x-www-form-urlencoded" },
		}
	  );
	  setIsLoading(false);
	  return response.data;
	} catch (err) {
	  console.error("Error in blood detection:", err.message);
	  return null;
	}
  }, []);
  
  // Updated deep fake detection to return results
  const checkDeepFake = useCallback(async (base64) => {
	console.log(2);
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
  
  

 

  const handleSubmit = async () => {
	if (!file) {
	  alert("Please upload an image file!");
	  return;
	}
  
	try {
	  // Convert the file to Base64 once for reuse in all APIs
	  const base64 = await loadImageBase64(file);
  
	  setIsLoading(true);
	  setError(null);
  
	  // Call all APIs simultaneously
	  const [nudityResult, deepFakeResult, bloodResult] = await Promise.all([
		checkSensitiveMedia(base64),
		checkDeepFake(base64),
		checkBloodDetection(base64),
	  ]);
  
	  // Process results
	  if (nudityResult?.predictions) {
		setBoundingBoxes(nudityResult.predictions); // Update bounding box data
	  }
  
	  if (deepFakeResult?.predictions?.Fake?.confidence >= 0.7) {
		console.log("Deep Fake Detected!");
	  } else {
		console.log("Image passed deep fake detection.");
	  }
  
	  if (bloodResult?.predictions) {
		setBloodDetectionResults(bloodResult.predictions); // Update blood detection results
	  }
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
  
		// Layer 1: Draw bounding boxes from the first API
		if (boundingBoxes.length > 0) {
		  boundingBoxes.forEach((box) => {
			const { x, y, width, height, class: className, confidence } = box;
  
			// Calculate the top-left corner
			const topLeftX = x - width / 2;
			const topLeftY = y - height / 2;
  
			// Draw bounding box
			ctx.strokeStyle = "yellow"; // Layer color
			ctx.lineWidth = 2;
			ctx.strokeRect(topLeftX, topLeftY, width, height);
  
			// Add label
			ctx.font = "16px Arial";
			ctx.fillStyle = "yellow"; // Layer color
			ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, topLeftX, topLeftY - 10);
		  });
		}
  
		// Layer 2: Draw bounding box for deep fake detection
		if (result?.predictions?.Fake?.confidence >= 0.7) {
		  ctx.font = "24px Arial";
		  ctx.fillStyle = "red";
		  ctx.fillText("FAKE", 10, 30); // Display "FAKE" at the top-left
		}
  
		// Layer 3: Draw bounding boxes from the third API
		if (bloodDetectionResults.length > 0) {
		  bloodDetectionResults.forEach((prediction) => {
			const { x, y, width, height, confidence, class: className } = prediction;
  
			// Calculate the top-left corner
			const topLeftX = x - width / 2;
			const topLeftY = y - height / 2;
  
			// Draw bounding box
			ctx.strokeStyle = "red"; // Layer color for third API
			ctx.lineWidth = 2;
			ctx.strokeRect(topLeftX, topLeftY, width, height);
  
			// Add label
			ctx.font = "16px Arial";
			ctx.fillStyle = "red";
			ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, topLeftX, topLeftY - 10);
		  });
		}
	  };
  
	  img.onerror = () => {
		console.error("Failed to load image");
	  };
	}
  }, [filePreview, boundingBoxes, result, bloodDetectionResults]); // Added bloodDetectionResults
  

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex">
      {/* Upload Section */}
      <div className="flex flex-col w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Image</h1>

        {/* File Input */}
        <div className="mb-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Submit"}
        </Button>

        {/* Canvas Preview */}
        <div className="mt-6">
          {filePreview && (
            <canvas
              ref={canvasRef}
              className="border rounded shadow"
              style={{ maxWidth: "100%" }}
            ></canvas>
          )}
          {!filePreview && <p className="text-gray-500">No image selected.</p>}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ImageCheck;
