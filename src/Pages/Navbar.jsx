/** @format */

import React, { useState } from "react";
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
	// State to toggle mobile menu
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className='flex items-center justify-between bg-white px-4 py-3 shadow-sm lg:px-6'>
			{/* Logo and Location */}
			<div className='flex items-center space-x-4'>
				<div className='text-red-600 text-lg font-bold'>KYN</div>
				{/* Hide input on smaller screens */}
				<Input
					placeholder='Anna Nagar'
					className='hidden sm:block w-32 lg:w-48 rounded-full px-3 py-2 border border-gray-300 text-sm'
				/>
			</div>

			{/* Navigation Links */}
			<div className='hidden sm:flex items-center space-x-6'>
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

			{/* Mobile Menu Icon */}
			<div className='sm:hidden relative'>
				<LucideMoreVertical
					className='w-6 h-6 text-gray-600 cursor-pointer'
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				/>

				{/* Dropdown Menu */}
				{isMenuOpen && (
					<div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50'>
						<Button
							variant='ghost'
							className='w-full flex items-center justify-start space-x-2 px-4 py-2 text-sm'>
							<LucideHome className='w-5 h-5 text-gray-600' />
							<span>Home</span>
						</Button>
						<Button
							variant='ghost'
							className='w-full flex items-center justify-start space-x-2 px-4 py-2 text-sm'>
							<LucideTv className='w-5 h-5 text-gray-600' />
							<span>Live</span>
						</Button>
						<Button
							variant='ghost'
							className='w-full flex items-center justify-start space-x-2 px-4 py-2 text-sm'>
							<LucideVideo className='w-5 h-5 text-gray-600' />
							<span>Videos</span>
						</Button>
						<Button
							variant='ghost'
							className='w-full flex items-center justify-start space-x-2 px-4 py-2 text-sm'>
							<LucideMoreVertical className='w-5 h-5 text-gray-600' />
							<span>Klips</span>
						</Button>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className='hidden sm:flex items-center space-x-4'>
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
