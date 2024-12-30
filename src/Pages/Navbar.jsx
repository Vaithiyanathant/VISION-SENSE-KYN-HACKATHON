/** @format */

import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar } from "../components/ui/avatar";
import {
	LucideHome,
	LucideTv,
	LucideVideo,
	LucideMoreVertical,
	LucideBell,
} from "lucide-react";

const Navbar = () => {
	return (
		<nav className='flex items-center justify-between bg-white px-6 py-3 shadow-sm'>
			{/* Logo and Location */}
			<div className='flex items-center space-x-4'>
				<div className='text-red-600 text-lg font-bold'>KYN</div>
				<Input
					placeholder='Anna Nagar'
					className='w-48 rounded-full px-3 py-2 border border-gray-300 text-sm'
				/>
			</div>

			{/* Navigation Links */}
			<div className='flex items-center space-x-6'>
				<Button
					variant='ghost'
					className='flex flex-col items-center text-xs'>
					<LucideHome className='w-5 h-5 text-red-600' />
					<span className='text-red-600'>Home</span>
				</Button>
				<Button
					variant='ghost'
					className='flex flex-col items-center text-xs'>
					<LucideTv className='w-5 h-5 text-gray-600' />
					<span>Live</span>
				</Button>
				<Button
					variant='ghost'
					className='flex flex-col items-center text-xs'>
					<LucideVideo className='w-5 h-5 text-gray-600' />
					<span>Videos</span>
				</Button>
				<Button
					variant='ghost'
					className='flex flex-col items-center text-xs'>
					<LucideMoreVertical className='w-5 h-5 text-gray-600' />
					<span>Klips</span>
				</Button>
			</div>

			{/* Action Buttons */}
			<div className='flex items-center space-x-4'>
				<Button
					variant='outline'
					className='flex items-center space-x-2 text-sm'>
					<span>+</span>
					<span>Create</span>
				</Button>
				<LucideBell className='w-6 h-6 text-gray-600' />
				<Avatar className='w-8 h-8 bg-gray-300' />
			</div>
		</nav>
	);
};

export default Navbar;
