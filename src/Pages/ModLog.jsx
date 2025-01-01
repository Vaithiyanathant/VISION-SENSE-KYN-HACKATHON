/** @format */

import React, { useState } from "react";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";

const ModLog = () => {
	const [data, setData] = useState([
		{
			contentId: "12345",
			contentType: "Text",
			previewUrl: "This is a sample text content.",
			submittedBy: "user123",
			moderationStatus: "Flagged",
			violationType: "Hate Speech",
			confidenceScore: 95,
			timestamp: "2024-12-31T12:34:56Z",
		},
		{
			contentId: "67890",
			contentType: "Image",
			previewUrl:
				"https://cubanvr.com/wp-content/uploads/2023/07/ai-image-generators.webp",
			submittedBy: "user456",
			moderationStatus: "Clean",
			violationType: "",
			confidenceScore: 100,
			timestamp: "2024-12-31T13:45:22Z",
		},
		{
			contentId: "11223",
			contentType: "Video",
			previewUrl: "https://via.placeholder.com/100",
			submittedBy: "user789",
			moderationStatus: "Rejected",
			violationType: "Violence",
			confidenceScore: 78,
			timestamp: "2024-12-30T15:22:10Z",
		},
		{
			contentId: "44556",
			contentType: "Text",
			previewUrl: "Another example of text content.",
			submittedBy: "user321",
			moderationStatus: "Flagged",
			violationType: "Obscene Content",
			confidenceScore: 88,
			timestamp: "2024-12-29T08:45:00Z",
		},
		{
			contentId: "77889",
			contentType: "Image",
			previewUrl: "https://via.placeholder.com/100",
			submittedBy: "user654",
			moderationStatus: "Clean",
			violationType: "",
			confidenceScore: 99,
			timestamp: "2024-12-28T20:30:10Z",
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filters, setFilters] = useState({
		contentType: "All",
		moderationStatus: "All",
		violationType: "All",
		confidenceScore: "All",
	});
	const [previewContent, setPreviewContent] = useState(null);

	const headers = [
		{ label: "Content ID", key: "contentId" },
		{ label: "Content Type", key: "contentType" },
		{ label: "Content Preview", key: "previewUrl" },
		{ label: "Submitted By", key: "submittedBy" },
		{ label: "Moderation Status", key: "moderationStatus" },
		{ label: "Violation Type", key: "violationType" },
		{ label: "Confidence Score", key: "confidenceScore" },
		{ label: "Timestamp", key: "timestamp" },
	];

	const applyFilters = (item) => {
		if (
			(filters.contentType !== "All" &&
				item.contentType !== filters.contentType) ||
			(filters.moderationStatus !== "All" &&
				item.moderationStatus !== filters.moderationStatus) ||
			(filters.violationType !== "All" &&
				item.violationType !== filters.violationType) ||
			(filters.confidenceScore !== "All" &&
				!(
					(filters.confidenceScore === "Below 50%" &&
						item.confidenceScore < 50) ||
					(filters.confidenceScore === "50%-80%" &&
						item.confidenceScore >= 50 &&
						item.confidenceScore <= 80) ||
					(filters.confidenceScore === "Above 80%" && item.confidenceScore > 80)
				))
		) {
			return false;
		}
		return true;
	};

	const filteredData = data.filter((item) => {
		return (
			applyFilters(item) &&
			(item.contentId.includes(searchTerm) ||
				item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	});

	return (
		<>
			<div className='p-6 bg-[#ffffff] min-h-screen'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-[#f15656]'>Moderation Logs</h1>
					<p className='text-lg text-black mt-2'></p>
				</div>

				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<CSVLink
						data={filteredData}
						headers={headers}
						filename={`moderation_logs_${new Date().toISOString()}.csv`}
						className='px-4 py-2 bg-[#f15656] text-white rounded-md hover:bg-[#b42f2f]'>
						Export as CSV
					</CSVLink>
				</div>

				{/* Search and Filters */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
					<input
						type='text'
						placeholder='Search by Content ID or Submitted By'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15656]'
					/>
					<select
						value={filters.contentType}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, contentType: e.target.value }))
						}
						className='px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15656]'>
						<option value='All'>All Content Types</option>
						<option value='Text'>Text</option>
						<option value='Image'>Image</option>
						<option value='Video'>Video</option>
					</select>
					<select
						value={filters.moderationStatus}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								moderationStatus: e.target.value,
							}))
						}
						className='px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15656]'>
						<option value='All'>All Moderation Status</option>
						<option value='Clean'>Clean</option>
						<option value='Flagged'>Flagged</option>
						<option value='Rejected'>Rejected</option>
					</select>
					<select
						value={filters.violationType}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, violationType: e.target.value }))
						}
						className='px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15656]'>
						<option value='All'>All Violation Types</option>
						<option value='Hate Speech'>Hate Speech</option>
						<option value='Violence'>Violence</option>
						<option value='Obscene Content'>Obscene Content</option>
						<option value='Misinformation'>Misinformation</option>
						<option value='Other'>Other</option>
					</select>
					<select
						value={filters.confidenceScore}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								confidenceScore: e.target.value,
							}))
						}
						className='px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15656]'>
						<option value='All'>All Confidence Scores</option>
						<option value='Below 50%'>Below 50% (Low)</option>
						<option value='50%-80%'>50%-80% (Moderate)</option>
						<option value='Above 80%'>Above 80% (High)</option>
					</select>
				</div>

				{/* Table */}
				<div className='overflow-x-auto bg-[#f9f9f9] shadow-md rounded-md'>
					<table className='min-w-full border-collapse'>
						<thead>
							<tr className='bg-[#f15656] text-white'>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Content ID
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Content Type
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Preview
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Submitted By
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Moderation Status
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Violation Type
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Confidence Score
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Timestamp
								</th>
								<th className='py-3 px-6 text-left whitespace-nowrap'>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredData.map((item, index) => (
								<tr
									key={index}
									className={`border-b hover:bg-gray-100`}>
									<td className='py-3 px-6'>{item.contentId}</td>
									<td className='py-3 px-6'>{item.contentType}</td>
									<td className='py-3 px-6'>
										<button
											onClick={() => setPreviewContent(item.previewUrl)}
											className='px-3 py-1 bg-[#f15656] text-white rounded-md hover:bg-[#b42f2f]'>
											Preview
										</button>
									</td>
									<td className='py-3 px-6'>{item.submittedBy}</td>
									<td
										className={`py-3 px-6 font-semibold ${
											item.moderationStatus === "Flagged"
												? "text-[#f15656]"
												: item.moderationStatus === "Clean"
												? "text-green-500"
												: "text-yellow-500"
										}`}>
										{item.moderationStatus}
									</td>
									<td className='py-3 px-6'>{item.violationType || "N/A"}</td>
									<td className='py-3 px-6'>{item.confidenceScore}%</td>
									<td className='py-3 px-6'>
										{dayjs(item.timestamp).format("MMM D, YYYY h:mm A")}
									</td>
									<td className='py-3 px-6 flex'>
										<button className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2'>
											Approve
										</button>
										<button className='px-3 py-1 bg-[#f15656] text-white rounded-md hover:bg-[#b42f2f]'>
											Reject
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Preview Modal */}
				{previewContent && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
						<div className='bg-white p-6 rounded-md shadow-md'>
							<h2 className='text-xl font-bold mb-4'>Content Preview</h2>
							<div className='mb-4'>
								{typeof previewContent === "string" &&
								previewContent.startsWith("http") ? (
									<img
										src={previewContent}
										alt='Preview'
										className='max-w-full max-h-96 rounded-md'
									/>
								) : (
									<p>{previewContent}</p>
								)}
							</div>
							<button
								onClick={() => setPreviewContent(null)}
								className='px-4 py-2 bg-[#f15656] text-white rounded-md hover:bg-[#b42f2f]'>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ModLog;
