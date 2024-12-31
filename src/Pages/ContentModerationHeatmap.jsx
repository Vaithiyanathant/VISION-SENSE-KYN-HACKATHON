/** @format */

import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const ContentModerationHeatmap = () => {
	const [heatmapData, setHeatmapData] = useState([]);
	const [days] = useState(Array.from({ length: 31 }, (_, i) => i + 1));
	const [months] = useState([
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]);

	useEffect(() => {
		// Updated sample data with diverse statuses and more entries
		const sampleData = [
			{ date: "2023-01-15", status: "flagged" },
			{ date: "2023-01-20", status: "clean" },
			{ date: "2023-02-10", status: "rejected" },
			{ date: "2023-03-25", status: "flagged" },
			{ date: "2023-05-15", status: "clean" },
			{ date: "2023-06-10", status: "rejected" },
			{ date: "2023-07-18", status: "flagged" },
			{ date: "2023-12-30", status: "clean" },
			{ date: "2023-12-15", status: "rejected" },
		];

		const groupedData = Array.from({ length: 12 }, () => new Array(31).fill(0));

		// Map statuses to numeric values for visualization
		const statusMap = {
			flagged: 3,
			rejected: 2,
			clean: 1,
		};

		sampleData.forEach((entry) => {
			const date = new Date(entry.date);
			const month = date.getMonth();
			const day = date.getDate() - 1;
			groupedData[month][day] = statusMap[entry.status];
		});

		const data = [];
		groupedData.forEach((days, monthIndex) => {
			days.forEach((count, dayIndex) => {
				data.push([dayIndex, monthIndex, count]);
			});
		});

		setHeatmapData(data);
	}, []);

	const chartOptions = {
		title: {
			text: "Content Moderation Heatmap (2023)",
			left: "center",
			textStyle: {
				color: "#374151",
				fontSize: 20,
			},
		},
		tooltip: {
			position: "top",
			formatter: ({ data }) => {
				const statusLabel = ["None", "Clean", "Rejected", "Flagged"];
				return `Day: ${data[0] + 1}, Month: ${months[data[1]]}<br>Status: ${
					statusLabel[data[2]]
				}`;
			},
		},
		grid: {
			height: "60%",
			top: "10%",
		},
		xAxis: {
			type: "category",
			data: days,
			splitArea: {
				show: true,
			},
			axisLabel: {
				color: "#374151",
			},
		},
		yAxis: {
			type: "category",
			data: months,
			splitArea: {
				show: true,
			},
			axisLabel: {
				color: "#374151",
			},
		},
		visualMap: {
			min: 0,
			max: 3,
			calculable: true,
			orient: "horizontal",
			left: "center",
			bottom: "5%",
			inRange: {
				color: ["#fee2e2", "#f87171", "#ef4444", "#b91c1c"], // Light red to dark red
			},
		},
		series: [
			{
				name: "Moderated Content",
				type: "heatmap",
				data: heatmapData,
				label: {
					show: true,
					formatter: ({ value }) => (value[2] ? value[2] : ""),
					color: "#374151",
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
				itemStyle: {
					borderColor:"", // Border color for squares
					borderWidth: 1,
				},
			},
		],
	};

	return (
		<div
			className=' p-6 flex flex-col items-center'
			style={{ fontFamily: "Arial, sans-serif" }}>
			<h1 className='text-red-600 text-2xl font-bold text-center mb-4'>
				Content Moderation Heatmap
			</h1>
			<ReactECharts
				option={chartOptions}
				style={{ height: "500px", width: "100%" }}
			/>
		</div>
	);
};

export default ContentModerationHeatmap;
