/** @format */

import React, { useState } from "react";
import {
	FaHome,
	FaBroadcastTower,
	FaFilm,
	FaCameraRetro,
	FaBell,
	FaUserCircle,
	FaEllipsisH,
	FaPlus,
	FaThumbsUp,
	FaThumbsDown,
	FaComment,
	FaShareAlt,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const SocialHome = () => {
	const [comments, setComments] = useState({});
	const [alertMessage, setAlertMessage] = useState("");

	const abusiveWords = ["fuck", "abuse", "badword"];

	const handleAddComment = (postId, comment) => {
		if (abusiveWords.some((word) => comment.toLowerCase().includes(word))) {
			setAlertMessage("Your comment contains inappropriate language!");
			setTimeout(() => setAlertMessage(""), 3000);
		} else {
			setComments({
				...comments,
				[postId]: [...(comments[postId] || []), comment],
			});
		}
	};

	return (
		<div className='bg-gray-100 min-h-screen'>
			{/* Navbar */}
			<div className='bg-white shadow-md border-b'>
				<div className='flex items-center justify-between px-6 py-3'>
					{/* Logo Section */}
					<div className='flex items-center space-x-2 ml-5'>
						<img
							src='https://kynhood.com/illustrations/logo.png'
							alt='kyn logo'
							className='w-10 h-10'
						/>
					</div>

					{/* Location Section */}
					<div className='flex items-center bg-gray-200 rounded-full px-4 py-2 space-x-2 ml-5'>
						<MdLocationOn className='text-gray-600 h-6 w-6' />
						<span className='text-gray-700 font-medium'>Search</span>
					</div>

					{/* Navigation Links Centered */}
					<div className='flex flex-1 justify-center space-x-12'>
						<div className='flex flex-col items-center'>
							<FaHome className='text-red-500 h-7 w-7' />
							<span className='text-sm text-red-500 font-semibold'>Home</span>
						</div>

						<div className='flex flex-col items-center'>
							<FaBroadcastTower className='text-black h-7 w-7' />
							<span className='text-sm font-semibold'>Live</span>
						</div>

						<div className='flex flex-col items-center'>
							<FaFilm className='text-black h-7 w-7' />
							<span className='text-sm font-semibold'>Videos</span>
						</div>

						<div className='flex flex-col items-center'>
							<FaCameraRetro className='text-black h-7 w-7' />
							<span className='text-sm font-semibold'>Klips</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex items-center space-x-4'>
						<button className='flex items-center px-4 py-2 border border-gray-400 rounded-full bg-gray-100 hover:bg-gray-200'>
							<FaPlus className='h-5 w-5 text-gray-600' />
							<span className='ml-2 font-medium text-gray-700'>Create</span>
						</button>

						<FaEllipsisH className='text-black h-6 w-6' />
						<FaBell className='text-black h-6 w-6' />
						<FaUserCircle className='text-gray-400 h-6 w-6' />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex mt-6 px-6 space-x-6'>
				{/* Left Sidebar */}
				<div className='w-1/4 bg-white rounded-lg shadow-md p-4'>
					<h2 className='text-lg font-semibold mb-4'>Notifications</h2>
					<ul className='space-y-3'>
						<li className='text-sm text-gray-700'>New comment on your post</li>
						<li className='text-sm text-gray-700'>John liked your photo</li>
						<li className='text-sm text-gray-700'>New follower: Sarah</li>
					</ul>
					<h2 className='text-lg font-semibold mt-6 mb-4'>Trending</h2>
					<ul className='space-y-3'>
						<li className='text-sm text-gray-700'>#ReactJS</li>
						<li className='text-sm text-gray-700'>#TailwindCSS</li>
						<li className='text-sm text-gray-700'>#WebDevelopment</li>
					</ul>
				</div>

				{/* Center Content */}
				<div className='w-1/2 bg-white rounded-lg shadow-md p-4'>
					<h2 className='text-lg font-semibold mb-4'>Add Post</h2>
					<textarea
						className='w-full h-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500'
						placeholder='What’s on your mind?'></textarea>
					<button className='mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600'>
						Post
					</button>

					<div className='mt-6'>
						<h2 className='text-lg font-semibold mb-4'>Recent Posts</h2>

						{/* Sample Image Post */}
						<div className='border border-gray-300 rounded-lg p-3 mb-4'>
							<h3 className='font-semibold'>John Doe</h3>
							<p className='text-sm text-gray-700 mb-2'>
								Excited to start my new project!
							</p>
							<img
								src='https://wallpaperaccess.com/full/4723250.jpg'
								alt='Post Image'
								className='w-full h-auto rounded-lg'
							/>
							<div className='flex justify-between items-center mt-3'>
								<div className='flex space-x-4'>
									<FaThumbsUp className='text-green-500 cursor-pointer' />
									<FaThumbsDown className='text-red-500 cursor-pointer' />
									<FaComment className='text-blue-500 cursor-pointer' />
									<FaShareAlt className='text-gray-500 cursor-pointer' />
								</div>
							</div>
							<div className='mt-2'>
								<textarea
									className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='Add a comment...'
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddComment("post1", e.target.value);
											e.target.value = "";
										}
									}}
								/>
								<div className='mt-2 space-y-2'>
									{comments["post1"] &&
										comments["post1"].map((comment, index) => (
											<p
												key={index}
												className='text-sm text-gray-600 bg-gray-100 p-2 rounded-lg'>
												{comment}
											</p>
										))}
								</div>
							</div>
						</div>
					</div>

					{alertMessage && (
						<div className='mt-4 p-4 bg-red-500 text-white rounded-lg'>
							{alertMessage}
						</div>
					)}
				</div>

				{/* Right Sidebar */}
				<div className='w-1/4 bg-white rounded-lg shadow-md p-4'>
					<div className='relative rounded-xl overflow-hidden flex flex-col items-center shadow-lg bg-white'>
						<div className='h-24 w-full bg-green-400'></div>
						<div className='-mt-12'>
							<img
								src='https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp'
								alt='Profile'
								className='w-25 h-25 rounded-full'
							/>
						</div>
						<div className='flex flex-col items-center mt-4'>
							<h2 className='text-lg font-semibold'>Cameron Williamson</h2>
							<p className='text-sm text-gray-600'>
								In the business of making things happen
							</p>
						</div>
						<div className='flex space-x-4 mt-4 m-10'>
							<button className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
								Followed
							</button>
							<button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300'>
								Message
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SocialHome;
