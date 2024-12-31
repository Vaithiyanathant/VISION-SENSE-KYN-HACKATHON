/** @format */

import React, { useState } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	LineChart,
	Line,
	CartesianGrid,
	AreaChart,
	Area,
} from "recharts";
import ContentModerationHeatmap from "./ContentModerationHeatmap";
import MapComponent from "./MapComponent";

const Analysis = () => {
	// Sample data for demonstration
	const contentTypeData = [
		{ name: "Image", value: 50 },
		{ name: "Video", value: 30 },
		{ name: "Text", value: 20 },
	];

	const userInsightsData = [
		{ name: "User A", value: 40 },
		{ name: "User B", value: 30 },
		{ name: "User C", value: 20 },
		{ name: "User D", value: 10 },
		{ name: "User E", value: 5 },
	];

	const confidenceScoreData = [
		{ name: "80-90%", value: 25 },
		{ name: "90-100%", value: 35 },
		{ name: "70-80%", value: 15 },
	];

	const trendsOverTimeData = [
		{ name: "Jan", Clean: 50, Flagged: 20, Rejected: 10 },
		{ name: "Feb", Clean: 60, Flagged: 15, Rejected: 5 },
		{ name: "Mar", Clean: 70, Flagged: 25, Rejected: 15 },
		{ name: "Apr", Clean: 80, Flagged: 10, Rejected: 5 },
	];

	const [selectedChartType, setSelectedChartType] = useState({
		contentType: "Pie",
		userInsights: "Pie",
		confidenceScore: "Pie",
		trends: "Line",
	});

	const renderChart = (data, chartType) => {
		switch (chartType) {
			case "Pie":
				return (
					<PieChart>
						<Pie
							data={data}
							dataKey='value'
							nameKey='name'
							cx='50%'
							cy='50%'
							outerRadius={100}
							innerRadius={60}
							paddingAngle={5}
							label={({ name, value }) => `${name}: ${value}`}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={["#42A5F5", "#64B5F6", "#90CAF9"][index % 3]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				);
			case "Bar":
				return (
					<BarChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis
							dataKey='name'
							stroke='#1E3A8A'
						/>
						<YAxis stroke='#1E3A8A' />
						<Tooltip />
						<Legend />
						<Bar
							dataKey='value'
							fill='#42A5F5'>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={["#42A5F5", "#64B5F6", "#90CAF9"][index % 3]}
								/>
							))}
						</Bar>
					</BarChart>
				);
			case "Line":
				return (
					<LineChart
						data={trendsOverTimeData}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Line
							type='monotone'
							dataKey='Clean'
							stroke='#82ca9d'
							activeDot={{ r: 8 }}
						/>
						<Line
							type='monotone'
							dataKey='Flagged'
							stroke='#8884d8'
							activeDot={{ r: 8 }}
						/>
						<Line
							type='monotone'
							dataKey='Rejected'
							stroke='#ff7300'
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				);
			case "Area":
				return (
					<AreaChart
						data={trendsOverTimeData}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Area
							type='monotone'
							dataKey='Clean'
							stroke='#82ca9d'
							fill='#82ca9d'
						/>
						<Area
							type='monotone'
							dataKey='Flagged'
							stroke='#8884d8'
							fill='#8884d8'
						/>
						<Area
							type='monotone'
							dataKey='Rejected'
							stroke='#ff7300'
							fill='#ff7300'
						/>
					</AreaChart>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{/* Analytics Heading */}
			<div className='text-center mb-8'>
				<h1 className='text-4xl font-bold text-blue-600'>
					Content Moderation Analytics
				</h1>
				<p className='text-lg text-gray-600 mt-2'>
					Track the status of content moderation in real-time
				</p>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-3xl'>⛔</span>
					</div>
					<h2 className='text-md font-semibold text-red-500'>Total</h2>
					<p className='text-4xl font-extrabold text-red-500 mt-2'>100</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-3xl'>✅</span>
					</div>
					<h2 className='text-md font-semibold text-green-500'>Clean</h2>
					<p className='text-4xl font-extrabold text-green-500 mt-2'>50</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-3xl'>🚨</span>
					</div>
					<h2 className='text-md font-semibold text-yellow-500'>Flagged</h2>
					<p className='text-4xl font-extrabold text-yellow-500 mt-2'>50</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-3xl'>⛔</span>
					</div>
					<h2 className='text-md font-semibold text-red-500'>Rejected</h2>
					<p className='text-4xl font-extrabold text-red-500 mt-2'>20</p>
				</div>
			</div>
			{/* Render Charts */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className='flex justify-center mb-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
							value={selectedChartType.contentType}
							onChange={(e) =>
								setSelectedChartType((prev) => ({
									...prev,
									contentType: e.target.value,
								}))
							}>
							<option value='Pie'>Pie Chart</option>
							<option value='Bar'>Bar Chart</option>
						</select>
					</div>
					<h2 className='text-lg font-semibold text-gray-700 text-center mb-4'>
						Content Type Analysis
					</h2>
					<ResponsiveContainer
						width='100%'
						height={400}>
						{renderChart(contentTypeData, selectedChartType.contentType)}
					</ResponsiveContainer>
				</div>
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<ContentModerationHeatmap />
				</div>
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className='flex justify-center mb-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
							value={selectedChartType.userInsights}
							onChange={(e) =>
								setSelectedChartType((prev) => ({
									...prev,
									userInsights: e.target.value,
								}))
							}>
							<option value='Pie'>Pie Chart</option>
							<option value='Bar'>Bar Chart</option>
						</select>
					</div>
					<h2 className='text-lg font-semibold text-gray-700 text-center mb-4'>
						User Insights (Top 5 Users)
					</h2>
					<ResponsiveContainer
						width='100%'
						height={400}>
						{renderChart(userInsightsData, selectedChartType.userInsights)}
					</ResponsiveContainer>
				</div>
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className='flex justify-center mb-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
							value={selectedChartType.confidenceScore}
							onChange={(e) =>
								setSelectedChartType((prev) => ({
									...prev,
									confidenceScore: e.target.value,
								}))
							}>
							<option value='Pie'>Pie Chart</option>
							<option value='Bar'>Bar Chart</option>
						</select>
					</div>
					<h2 className='text-lg font-semibold text-gray-700 text-center mb-4'>
						Confidence Score Distribution
					</h2>
					<ResponsiveContainer
						width='100%'
						height={400}>
						{renderChart(
							confidenceScoreData,
							selectedChartType.confidenceScore
						)}
					</ResponsiveContainer>
				</div>
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className='flex justify-center mb-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
							value={selectedChartType.trends}
							onChange={(e) =>
								setSelectedChartType((prev) => ({
									...prev,
									trends: e.target.value,
								}))
							}>
							<option value='Line'>Line Chart</option>
							<option value='Area'>Area Chart</option>
						</select>
					</div>
					<h2 className='text-lg font-semibold text-gray-700 text-center mb-4'>
						Trends Over Time
					</h2>
					<ResponsiveContainer
						width='100%'
						height={400}>
						{renderChart(trendsOverTimeData, selectedChartType.trends)}
					</ResponsiveContainer>
				</div>
				<MapComponent />
			</div>
		</>
	);
};

export default Analysis;