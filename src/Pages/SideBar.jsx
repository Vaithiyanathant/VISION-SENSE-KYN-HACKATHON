/** @format */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaChartPie } from "react-icons/fa";

const Sidebar = () => {
	const location = useLocation();

	const links = [
		{
			name: "Home",
			path: "/",
			icon: <FaHome className='h-5 w-5 mr-3' />,
		},
		{
			name: "Moderation Log",
			path: "/Dashboard/Mod-log",
			icon: <FaUsers className='h-5 w-5 mr-3' />,
		},
		{
			name: "Analysis",
			path: "/Dashboard/Mod-analysis",
			icon: <FaChartPie className='h-5 w-5 mr-3' />,
		},
	];

	return (
		<div className='bg-white h-screen w-64 flex flex-col text-gray-700 border-r shadow-md'>
			{/* Navigation Links */}
			<nav className='flex-1 overflow-y-auto p-4'>
				<ul className='space-y-2'>
					{links.map((link) => (
						<li key={link.name}>
							<Link
								to={link.path}
								className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
									location.pathname === link.path
										? "bg-[#f15656] text-white"
										: "text-gray-700 hover:bg-blue-100 hover:text-[#f15656]"
								}`}>
								{link.icon}
								<span>{link.name}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
