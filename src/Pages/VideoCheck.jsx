import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";

const loadFrameBase64 = (canvas, videoElement) => {
  const ctx = canvas.getContext("2d");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg"); // Convert the current frame to Base64
};

const VideoCheck = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null); // For overlaying bounding boxes
  const hiddenCanvasRef = useRef(null); // For frame extraction

  // Handle video upload
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(URL.createObjectURL(selectedFile));
      setBoundingBoxes([]);
    }
  };

  // Analyze the current frame using APIs
  const analyzeFrame = async (frameBase64) => {
    try {
      const [nudityResult, deepFakeResult, bloodResult] = await Promise.all([
        checkSensitiveMedia(frameBase64),
        checkDeepFake(frameBase64),
        checkBloodDetection(frameBase64),
      ]);

      // Combine bounding box results
      const boxes = [];
      if (nudityResult?.predictions) {
        boxes.push(...nudityResult.predictions.map((box) => ({ ...box, color: "yellow" })));
      }
      if (bloodResult?.predictions) {
        boxes.push(...bloodResult.predictions.map((box) => ({ ...box, color: "red" })));
      }
      if (deepFakeResult?.predictions?.Fake?.confidence >= 0.7) {
        boxes.push({ class: "Fake", confidence: deepFakeResult.predictions.Fake.confidence, color: "blue" });
      }

      setBoundingBoxes(boxes);
    } catch (err) {
      console.error("Error during frame analysis:", err.message);
    }
  };

  // API Functions
  const checkSensitiveMedia = async (base64) => {
    try {
      const response = await axios.post("https://detect.roboflow.com/explicit/1", base64, {
        params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    } catch (err) {
      console.error("Error in nudity detection:", err.message);
      return null;
    }
  };

  const checkDeepFake = async (base64) => {
    try {
      const response = await axios.post("https://classify.roboflow.com/deep-fake-detection-xxa8f/1", base64, {
        params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    } catch (err) {
      console.error("Error in deep fake detection:", err.message);
      return null;
    }
  };

  const checkBloodDetection = async (base64) => {
    try {
      const response = await axios.post("https://detect.roboflow.com/sensitive-content-2-1vqje/1", base64, {
        params: { api_key: "77NfUfT1hzpTIkkF3h3F" },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    } catch (err) {
      console.error("Error in blood detection:", err.message);
      return null;
    }
  };

  // Draw bounding boxes on the canvas
  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundingBoxes.forEach((box) => {
      const { x, y, width, height, class: className, confidence, color } = box;

      // Calculate the top-left corner
      const topLeftX = x - width / 2;
      const topLeftY = y - height / 2;

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(topLeftX, topLeftY, width, height);

      // Add label
      ctx.font = "16px Arial";
      ctx.fillStyle = color;
      ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, topLeftX, topLeftY - 10);
    });
  };

  // Process video frames on Submit
  const processVideo = async () => {
    console.log("Submit button clicked, processVideo started");
    if (!videoRef.current) return;
    setIsAnalyzing(true);
    setError(null);
    console.log("Submit button clicked, processVideo 2");
    const video = videoRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;

    while (!video.paused && !video.ended) {
      const frameBase64 = loadFrameBase64(hiddenCanvas, video);
      await analyzeFrame(frameBase64);
      drawBoundingBoxes();

      // Wait for the next frame (process every 1 second for efficiency)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex">
      {/* Upload Section */}
      <div className="flex flex-col w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

        {/* File Input */}
        <div className="mb-4">
          <Input type="file" accept="video/*" onChange={handleFileChange} />
        </div>

        {/* Video and Canvas */}
        {file && (
          <div className="relative">
            <video ref={videoRef} src={file} controls className="w-full rounded shadow" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>
        )}
        <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />

        {/* Submit Button */}
        <Button
          onClick={processVideo}
          className="mt-4 bg-blue-600 text-white"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Submit"}
        </Button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};


export default VideoCheck;
