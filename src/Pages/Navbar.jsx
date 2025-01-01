/** @format */

import React, { useState } from "react";
import {
	LucideHome,
	LucideUpload,
	LucideLayout,
	LucideMoreVertical,
	LucideBell,
} from "lucide-react";
import { Link } from "react-router-dom"; // Import Link from React Router

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);

	return (
		<nav className='sticky top-0 z-50 bg-white shadow-md'>
			<div className='container mx-auto flex items-center justify-between px-4 py-3'>
				{/* Logo */}
				<div className='flex items-center space-x-4'>
					<div className='text-red-600 text-lg font-bold'>
						<h1 class='text-4xl font-bold'>
							<span class='text-black'>Vision</span>
							<span class='text-purple-500'>Sense</span>
						</h1>
					</div>
				</div>

				{/* Center Navigation Links */}
				<div className='hidden md:flex flex-1 justify-center items-center space-x-12'>
					<Link
						to='/'
						className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition'>
						<LucideHome className='w-6 h-6 mb-1' />
						<span>Home</span>
					</Link>

					{/* Upload Dropdown */}
					<div className='relative'>
						<div
							className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition cursor-pointer'
							onClick={() => setIsUploadDropdownOpen(!isUploadDropdownOpen)}>
							<LucideUpload className='w-6 h-6 mb-1' />
							<span>Upload</span>
						</div>
						{/* Dropdown Menu */}
						{isUploadDropdownOpen && (
							<div className='absolute top-12 left-0 bg-white shadow-md rounded-md z-10 w-36'>
								<Link
									to='/text'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
									Text
								</Link>
								<Link
									to='/image'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
									Image
								</Link>
								<Link
									to='/video'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
									Video
								</Link>
								<Link
									to='/live-stream'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
									Live Stream
								</Link>
							</div>
						)}
					</div>

					<Link
						to='/Dashboard/Mod-log'
						className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition'>
						<LucideLayout className='w-6 h-6 mb-1' />
						<span>Dashboard</span>
					</Link>
				</div>

				{/* Right Action Links */}
				<div className='hidden md:flex items-center space-x-6'>
					<Link
						to='https://github.com/Vaithiyanathant/VISION-SENSE-KYN-HACKATHON.git'
						className='text-sm text-gray-700 hover:text-blue-600 font-medium transition'>
						View Source Code
					</Link>
					
					<div className='w-6 h-6 text-gray-700 hover:text-blue-600 cursor-pointer' />
				</div>

				{/* Mobile Menu Icon */}
				<div className='md:hidden'>
					<div
						className='w-6 h-6 text-gray-700 cursor-pointer'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMenuOpen && (
				<div className='md:hidden bg-gray-50 shadow-lg'>
					<Link
						to='/'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Home
					</Link>
					<Link
						to='/text'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Text
					</Link>
					<Link
						to='/image'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Image
					</Link>
					<Link
						to='/video'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Video
					</Link>
					<Link
						to='/live-stream'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Live Stream
					</Link>
					<Link
						to='/features'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Features
					</Link>
					<Link
						to='/about'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						About
					</Link>
					<Link
						to='/contributors'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Contributors
					</Link>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
