/** @format */

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon
const customIcon = new L.Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
	iconSize: [40, 40],
	iconAnchor: [20, 40],
	popupAnchor: [0, -40],
});

const sampleMarkers = [
	{
		position: [13.0827, 80.2707],
		popup: {
			applicationId: "001",
			contentType: "Image",
			submittedBy: "User A",
			moderationStatus: "Approved",
			confidenceScore: "95%",
		},
	},
	{
		position: [28.6139, 77.209],
		popup: {
			applicationId: "002",
			contentType: "Video",
			submittedBy: "User B",
			moderationStatus: "Rejected",
			confidenceScore: "87%",
		},
	},
	{
		position: [19.076, 72.8777],
		popup: {
			applicationId: "003",
			contentType: "Text",
			submittedBy: "User C",
			moderationStatus: "Flagged",
			confidenceScore: "73%",
		},
	},
	{
		position: [12.9716, 77.5946],
		popup: {
			applicationId: "004",
			contentType: "Image",
			submittedBy: "User D",
			moderationStatus: "Approved",
			confidenceScore: "92%",
		},
	},
	{
		position: [22.5726, 88.3639],
		popup: {
			applicationId: "005",
			contentType: "Video",
			submittedBy: "User E",
			moderationStatus: "Pending",
			confidenceScore: "81%",
		},
	},
	{
		position: [17.385, 78.4867],
		popup: {
			applicationId: "006",
			contentType: "Text",
			submittedBy: "User F",
			moderationStatus: "Rejected",
			confidenceScore: "66%",
		},
	},
	{
		position: [11.0168, 76.9558],
		popup: {
			applicationId: "007",
			contentType: "Image",
			submittedBy: "User G",
			moderationStatus: "Approved",
			confidenceScore: "88%",
		},
	},
	{
		position: [21.1458, 79.0882],
		popup: {
			applicationId: "008",
			contentType: "Video",
			submittedBy: "User H",
			moderationStatus: "Flagged",
			confidenceScore: "77%",
		},
	},
	{
		position: [23.0225, 72.5714],
		popup: {
			applicationId: "009",
			contentType: "Text",
			submittedBy: "User I",
			moderationStatus: "Approved",
			confidenceScore: "90%",
		},
	},
	{
		position: [15.2993, 74.124],
		popup: {
			applicationId: "010",
			contentType: "Image",
			submittedBy: "User J",
			moderationStatus: "Pending",
			confidenceScore: "85%",
		},
	},
];

const MapComponent = ({
	markersData = sampleMarkers,
	center = [20.5937, 78.9629], // Center of India
	zoom = 4, // Suitable zoom level for India
}) => {
	return (
		<div className='p-6 bg-white rounded-lg shadow-md border border-gray-200'>
			<div
				className='p-2'
				style={{
					height: "600px",
					borderBottomLeftRadius: "10px",
					borderBottomRightRadius: "10px",
				}}>
				<MapContainer
					center={center}
					zoom={zoom}
					scrollWheelZoom={true}
					style={{
						height: "100%",
						width: "100%",
					}}>
					{/* Tile Layer for the background */}
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
					/>

					{/* Dynamic Markers */}
					{markersData.length > 0 ? (
						markersData.map((marker, index) => (
							<Marker
								key={index}
								position={marker.position}
								icon={customIcon}>
								<Popup>
									<div className='p-2'>
										<h4 className='font-bold text-lg text-blue-800 mb-2'>
											Application ID:{" "}
											<span className='text-gray-700'>
												{marker.popup.applicationId}
											</span>
										</h4>
										<div className='text-sm space-y-1'>
											<p>
												<strong className='text-gray-800'>Content Type:</strong>{" "}
												<span className='text-gray-600'>
													{marker.popup.contentType}
												</span>
											</p>
											<p>
												<strong className='text-gray-800'>Submitted By:</strong>{" "}
												<span className='text-gray-600'>
													{marker.popup.submittedBy}
												</span>
											</p>
											<p>
												<strong className='text-gray-800'>
													Moderation Status:
												</strong>{" "}
												<span
													className={`${
														marker.popup.moderationStatus === "Approved"
															? "text-green-600"
															: marker.popup.moderationStatus === "Rejected"
															? "text-red-600"
															: "text-yellow-600"
													}`}>
													{marker.popup.moderationStatus}
												</span>
											</p>
											<p>
												<strong className='text-gray-800'>
													Confidence Score:
												</strong>{" "}
												<span className='text-gray-600'>
													{marker.popup.confidenceScore}
												</span>
											</p>
										</div>
									</div>
								</Popup>
							</Marker>
						))
					) : (
						<p className='text-center text-gray-500'>No markers to display.</p>
					)}
				</MapContainer>
			</div>
		</div>
	);
};

export default MapComponent;
