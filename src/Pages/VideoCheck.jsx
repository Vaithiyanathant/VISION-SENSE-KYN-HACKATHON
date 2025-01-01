/** @format */

import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import { db } from "../../firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import Loader from "./Loader";
import Navbar from "./Navbar";

const VideoCheck = () => {
  const [render, setRender] = useState(false);
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const [file, setFile] = useState(null);
  const [interval, setInterval] = useState(0.2); // Frame interval in seconds
  const [report, setReport] = useState(null); // Consolidated report state

  // We'll store a className here that sets width/height based on the aspect ratio
  const [videoClass, setVideoClass] = useState("");

  // --- API Calls ---
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

  // --- Drawing helper ---
  const drawBoundingBoxes = (ctx, predictions, color, scaleX = 1, scaleY = 1) => {
    predictions.forEach(
      ({ x, y, width, height, class: className, confidence }) => {
        const topLeftX = (x - width / 2) * scaleX;
        const topLeftY = (y - height / 2) * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

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
      }
    );
  };

  // --- Frame by Frame Processing ---
  const processFrameByFrame = async () => {
    setRender(true);
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
        await addDoc(reportsCollection, {
          ...finalReport,
          timestamp: new Date().toISOString(),
        });
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
        checkBloodDetection(frameBase64), // Uncomment if you want blood detection
      ]);

      // Draw bounding boxes on the frame
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(hiddenCanvas, 0, 0);

      if (sensitiveResult?.predictions?.length > 0) {
        drawBoundingBoxes(displayCtx, sensitiveResult.predictions, "yellow");
        sensitiveContentCount++;
      }
      if (
        deepFakeResult?.predictions?.Fake &&
        deepFakeResult.predictions.Fake.confidence >= 0.7
      ) {
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

  // --- Handle File Upload ---
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(URL.createObjectURL(selectedFile));
      setReport(null);
      setRender(false);
    }
  };

  // --- Handle dynamic aspect ratio ---
  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const ratio = w / h;

    if (ratio >= 1) {
      // Landscape / 16:9
      setVideoClass("w-full h-64 object-contain rounded shadow");
    } else {
      // Portrait / 9:16
      setVideoClass("w-[300px] h-[533px] object-contain rounded shadow");
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <div className="min-h-screen bg-[#f9f9f9] p-6">
        {/* Use grid-cols-[25%_75%] to reduce width of first column */}
        <div className="grid grid-cols-1 md:grid-cols-[25%_75%] gap-4">
          {/* LEFT COLUMN: Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Upload Section
            </h2>
            <p className="text-gray-700 mb-4">
              Upload your video and set the frame interval.
            </p>

            <div className="bg-[#f9f9f9] p-6 flex flex-col items-center rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-6 text-black">
                Upload and Process Video
              </h1>

              {/* Video File Upload */}
              <div className="mb-4">
                <label
                  htmlFor="file-upload"
                  className="custum-file-upload flex flex-col items-center justify-center h-48 w-72 cursor-pointer border-2 border-dashed border-gray-300 bg-[#ffffff] rounded-lg shadow-md hover:border-[#f15656] hover:bg-[#f9f9f9] transition"
                >
                  <div className="icon flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-16 w-16 text-gray-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text flex items-center justify-center">
                    <span className="text-gray-600">Click to upload video</span>
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Frame Interval Input */}
              <div className="mb-4 w-full flex items-center">
                <label className="mr-2 font-medium text-black">
                  Frame Interval (seconds):
                </label>
                <input
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="p-1 border border-gray-300 rounded w-1/2"
                />
              </div>

              {/* Publish Button */}
              <button className="mt-4 bg-[#f15656] text-white py-2 px-6 rounded hover:bg-[#d14e4e] transition-all w-full">
                Publish
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (2 Rows): 
              Row 1 => (Left: Original Video, Right: Processed Canvas)
              Row 2 => Detailed Report
          */}
          <div className="flex flex-col gap-4">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Video */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Original Video
                </h2>
                <p className="text-gray-700 mb-2">
                  This is the uploaded video preview.
                </p>
                {file && (
                  <video
                    ref={videoRef}
                    src={file}
                    controls
                    onLoadedMetadata={handleMetadataLoaded}
                    className={`${videoClass} mt-2`}
                  />
                )}
              </div>

              {/* Processed Frames (Canvas) -- same size as Original Video */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Processed Frames
                </h2>
                <p className="text-gray-700 mb-2">
                  Bounding boxes & results will show here.
                </p>

                {file && (
                  <>
                    {/* Hidden Canvas (for capturing frames) */}
                    <canvas
                      ref={hiddenCanvasRef}
                      style={{ display: "none" }}
                    ></canvas>

                    {/* Apply same class as video for the canvas */}
                    <canvas
                      ref={displayCanvasRef}
                      className={`${videoClass} mt-2`}
                    ></canvas>

                    <button
                      onClick={processFrameByFrame}
                      className="mt-4 p-2 bg-[#f15656] text-white rounded hover:bg-[#d14e4e]"
                    >
                      Process Video
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ROW 2: Detailed Report */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Detailed Report
              </h2>
              <p className="text-gray-700">
                This section provides the detailed report of the analysis.
              </p>

              {/* Loading or final JSON */}
              {!report && render ? (
                <div className="flex justify-center items-center mt-6">
                  <Loader />
                </div>
              ) : (
                report && (
					
                  <div className="mt-6 w-full">
                    <h2 className="text-lg font-semibold mb-4 text-black">
                      Video Processing Summary:
                    </h2>
					<p className="mt-4 text-gray-700">{report.summary}</p>
                    <pre className="bg-[#f9f9f9] p-4 rounded overflow-auto text-sm">
                      {JSON.stringify(report, null, 2)}
                    </pre>
                 
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCheck;
