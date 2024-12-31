/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./SideBar";
import Analysis from "./Analysis";
// import Navbar from "./Navbar";
// import ModLog from "./ModLog"; // You can change this to the appropriate component for ModAnalysis if needed

const ModAnalysis = () => {
	return (
		<div className='flex h-screen bg-gray-100'>
			{/* Sidebar */}
			<div className='w-64 bg-white shadow-md hidden md:block'>
				<Sidebar
					links={[
						{
							name: "Moderation Analysis", // Change this name if needed
							path: "/Dashboard/Mod-analysis", // Update path as per your routing
							icon: "analytics", // You can change the icon accordingly
						},
					]}
				/>
			</div>

			{/* Page Content */}
			<div className='p-6 flex-1 bg-[#f9fafb] overflow-y-auto'>
				<Analysis />
			</div>
		</div>
	);
};

export default ModAnalysis;
