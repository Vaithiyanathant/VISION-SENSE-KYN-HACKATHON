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

	return (
		<nav className='sticky top-0 z-50 bg-white shadow-md'>
			<div className='container mx-auto flex items-center justify-between px-4 py-3'>
				{/* Logo and Empty Placeholder */}
				<div className='flex items-center space-x-4'>
					<div className='text-red-600 text-lg font-bold'>Vaith</div>
					<div className='hidden sm:block w-32 lg:w-48 rounded-full px-3 py-2 '></div>
				</div>

				{/* Center Navigation Links */}
				<div className='hidden md:flex flex-1 justify-center items-center space-x-12'>
					<Link
						to='/'
						className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition'>
						<LucideHome className='w-6 h-6 mb-1' />
						<span>Home</span>
					</Link>
					<Link
						to='/FileUpload'
						className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition'>
						<LucideUpload className='w-6 h-6 mb-1' />
						<span>Upload</span>
					</Link>
					<Link
						to='/Dashboard/Mod-log'
						className='flex flex-col items-center text-sm text-gray-700 hover:text-blue-600 transition'>
						<LucideLayout className='w-6 h-6 mb-1' />
						<span>Dashboard</span>
					</Link>
				</div>

				{/* Right Action Links */}
				<div className='hidden md:flex items-center space-x-6'>
					<a
						href='/features'
						className='text-sm text-gray-700 hover:text-blue-600 font-medium transition'>
						Features
					</a>
					<a
						href='/about'
						className='text-sm text-gray-700 hover:text-blue-600 font-medium transition'>
						About
					</a>
					<a
						href='/contributors'
						className='text-sm text-gray-700 hover:text-blue-600 font-medium transition'>
						Contributors
					</a>
					<div className='w-6 h-6 text-gray-700 hover:text-blue-600 cursor-pointer' />
				</div>

				{/* Mobile Menu Icon */}
				<div className='md:hidden'>
					<LucideMoreVertical
						className='w-6 h-6 text-gray-700 cursor-pointer'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMenuOpen && (
				<div className='md:hidden bg-gray-50 shadow-lg'>
					import {Link} from "react-router-dom"; // Import Link from
					react-router-dom
					<Link
						to='/'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Home
					</Link>
					<Link
						to='/FileUpload'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Upload
					</Link>
					<Link
						to='/Dashboard/Mod-log'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600'>
						Dashboard
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
