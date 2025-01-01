/** @format */

import React, { useState, useEffect } from "react";
import { useTypewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const FeaturesHome = () => {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const [text] = useTypewriter({
		words: [
    "The future of content moderation.",
    "Enhance your digital experience.",
    "Get started with VisionSense today.",
		],
		loop: 0,
		typeSpeed: 50,
		deleteSpeed: 30,
		delaySpeed: 1000,
	});

	useEffect(() => {
		const countdownDate = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 hours from now

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = countdownDate - now;

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setTimeLeft({ days, hours, minutes, seconds });

			if (distance < 0) {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Navbar></Navbar>

			<div className='bg-gray-50 dotted-bg text-gray-800 min-h-screen flex flex-col items-center justify-center font-sans relative'>
				{/* Hero Section */}
				<main className='text-center px-6 space-y-10 animate-slide-up'>
					<p className='text-xl text-gray-500'>Introducing</p>
					<h1 className='text-6xl md:text-7xl font-extrabold text-gray-800 '>
						Vision{" "}
						<span className='text-purple-500 animated-gradient-text'>
							Sense
						</span>
					</h1>
					<p className='text-2xl text-gray-600'>
						{text}
						<span className='text-purple-500 blinking-cursor'>|</span>
					</p>

					{/* Buttons */}
					<div className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 justify-center'>
						<Link to='https://youtu.be/IXCUdJDTnIo'>
						<button className='px-8 py-4 text-lg text-blue-600 border border-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition shadow-md'>
							Demo
						</button>
						</Link>
						<Link to='/text'>
							<button className='px-8 py-4 text-lg text-green-600 border border-green-600 rounded-lg bg-green-50 hover:bg-green-100 transition shadow-md'>
								Get Started
							</button>
						</Link>
						<Link to='https://github.com/Vaithiyanathant/VISION-SENSE-KYN-HACKATHON.git'>
						<button className='px-8 py-4 text-lg text-purple-600 border border-purple-600 rounded-lg bg-purple-50 hover:bg-purple-100 transition shadow-md'>
							View Features
						</button>
						</Link>
					</div>
				</main>

				{/* Scroll Indicator */}
				<div className='absolute bottom-10'>
					<div className='w-4 h-4 rounded-full bg-gray-800 animate-bounce'></div>
				</div>
			</div>

			{/* CSS for Blinking Cursor */}
			<style jsx>{`
				.blinking-cursor {
					animation: blink 1s step-end infinite;
				}
				@keyframes blink {
					from,
					to {
						opacity: 1;
					}
					50% {
						opacity: 0;
					}
				}
			`}</style>
		</>
	);
};

export default FeaturesHome;
