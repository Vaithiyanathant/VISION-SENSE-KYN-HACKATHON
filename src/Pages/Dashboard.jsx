/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import ModLog from "./ModLog";

const Dashboard = () => {
	return (
		<div className='flex h-screen bg-gray-100'>
			{/* Sidebar */}
			<div className='w-64 bg-white shadow-md hidden md:block'>
				<Sidebar
					links={[
						{
							name: "Moderation Log",
							path: "/ModLog",
							icon: "users",
						},
					]}
				/>
			</div>

			{/* Main Content */}

			{/* Page Content */}
			<div className='p-6 flex-1 bg-[#f9fafb] overflow-y-auto'>
				<ModLog />
			</div>
		</div>
	);
};

export default Dashboard;
