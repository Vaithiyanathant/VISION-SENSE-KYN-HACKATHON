import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import { db } from "../../firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

const VideoCheck = () => {
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const [file, setFile] = useState(null);
  const [interval, setInterval] = useState(0.2); // Frame interval in seconds
  const [report, setReport] = useState(null); // Consolidated report state

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

  const drawBoundingBoxes = (ctx, predictions, color, scaleX = 1, scaleY = 1) => {
    predictions.forEach(({ x, y, width, height, class: className, confidence }) => {
      const topLeftX = (x - width / 2) * scaleX;
      const topLeftY = (y - height / 2) * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(topLeftX, topLeftY, scaledWidth, scaledHeight);

      // Add label
      ctx.font = "16px Arial";
      ctx.fillStyle = color;
      ctx.fillText(
        `${className} (${(confidence * 100).toFixed(1)}%)`,
        topLeftX,
        topLeftY - 10
      );
    });
  };

  const processFrameByFrame = async () => {
    const video = videoRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!video || !hiddenCanvas || !displayCanvas) return;

    const hiddenCtx = hiddenCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");

    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;
    displayCanvas.width = video.videoWidth;
    displayCanvas.height = video.videoHeight;

    let sensitiveContentCount = 0;
    let deepFakeCount = 0;
    let bloodDetectionCount = 0;
    let totalFrames = 0;

    const processNextFrame = async () => {
      if (video.ended || video.currentTime >= video.duration) {
        console.log("Processing complete");
        const finalReport = {
          totalFrames,
          sensitiveContentCount,
          deepFakeCount,
          bloodDetectionCount,
          summary: `Processed ${totalFrames} frames. Detected ${sensitiveContentCount} frames with sensitive content, ${deepFakeCount} deep fake instances, and ${bloodDetectionCount} frames with blood or injuries.`,
        };
        console.log("Final Report:", finalReport);
        setReport(finalReport);

        // Save report to Firestore
        const reportsCollection = collection(db, "videoReports");
        await addDoc(reportsCollection, { ...finalReport, timestamp: new Date().toISOString() });
        console.log("Report saved to Firestore.");
        return;
      }

      video.pause();
      hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

      const frameBase64 = hiddenCanvas.toDataURL("image/jpeg");

      // Analyze the frame using all APIs
      const [sensitiveResult, deepFakeResult, bloodResult] = await Promise.all([
        checkSensitiveMedia(frameBase64),
        checkDeepFake(frameBase64),
        checkBloodDetection(frameBase64),
      ]);

      // Draw bounding boxes on the frame
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(hiddenCanvas, 0, 0);

      if (sensitiveResult?.predictions?.length > 0) {
        drawBoundingBoxes(displayCtx, sensitiveResult.predictions, "yellow");
        sensitiveContentCount++;
      }
      if (deepFakeResult?.predictions?.Fake?.confidence >= 0.7) {
        deepFakeCount++;
      }
      if (bloodResult?.predictions?.length > 0) {
        drawBoundingBoxes(displayCtx, bloodResult.predictions, "red");
        bloodDetectionCount++;
      }

      totalFrames++;
      video.currentTime += parseFloat(interval);

      video.addEventListener("seeked", processNextFrame, { once: true });
    };

    processNextFrame();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Upload and Process Video Frame by Frame</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Frame Interval (seconds):</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          min="0.1"
          step="0.1"
          className="p-1 border rounded"
        />
      </div>

      {file && (
        <div className="relative w-full max-w-lg">
          <video
            ref={videoRef}
            src={file}
            controls
            className="w-full rounded shadow mb-4"
          />
          <canvas ref={hiddenCanvasRef} style={{ display: "none" }}></canvas>
          <canvas ref={displayCanvasRef} className="w-full rounded shadow"></canvas>
          <button
            onClick={processFrameByFrame}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Process Frame by Frame
          </button>
        </div>
      )}

      {report && (
        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-4">Video Processing Summary:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(report, null, 2)}
          </pre>
          <p className="mt-4 text-gray-700">{report.summary}</p>
        </div>
      )}
    </div>
  );
};

export default VideoCheck;
