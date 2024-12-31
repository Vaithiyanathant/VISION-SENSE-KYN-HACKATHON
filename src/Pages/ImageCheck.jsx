/** @format */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { db } from "../../firebase"; // Import the Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

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
      const deepFakeDetected = deepFakeResult?.predictions?.Fake?.confidence >= 0.7;
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
          ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, topLeftX, topLeftY - 10);
        });

        bloodDetectionResults.forEach((prediction) => {
          const { x, y, width, height, confidence, class: className } = prediction;
          const topLeftX = x - width / 2;
          const topLeftY = y - height / 2;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(topLeftX, topLeftY, width, height);
          ctx.font = "16px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, topLeftX, topLeftY - 10);
        });
      };

      img.onerror = () => {
        console.error("Failed to load image");
      };
    }
  }, [filePreview, boundingBoxes, bloodDetectionResults]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex">
      <div className="flex flex-col w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Image</h1>

        <div className="mb-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <Button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Submit"}
        </Button>

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

        {report && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Analysis Summary:</h2>
            <p className="bg-gray-100 p-4 rounded">{report.summary}</p>
            <h2 className="text-lg font-semibold mt-6">Detailed Report:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ImageCheck;