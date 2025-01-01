/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import ModLog from "./ModLog";

const Dashboard = () => {
	return (
		<>
			<Navbar />
			<div className='flex h-screen bg-[#f9f9f9]'>
				{/* Sidebar */}
				<div className='w-64 bg-[#ffffff] shadow-md hidden md:block'>
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
				<div className='p-6 flex-1 bg-[#f9f9f9] overflow-y-auto'>
					<div className='bg-[#ffffff] shadow-lg rounded-lg p-6'>
						<ModLog />
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
