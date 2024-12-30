/** @format */
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "../components/ui/accordion";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import Navbar from "./Navbar";

export default function HomePage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar></Navbar>
			{/* Main Content */}
			<div className='container mx-auto py-6 flex gap-6'>
				{/* Left Sidebar */}
				<div className='w-1/4'>
					<Card className='p-4 shadow-md bg-white'>
						<Accordion
							type='single'
							collapsible>
							<AccordionItem value='follow'>
								<AccordionTrigger className='text-lg font-bold'>
									Follow your KYNs
								</AccordionTrigger>
								<AccordionContent>
									<ul className='space-y-4'>
										{["Janpan bites", "Venkat", "VJ Arun", "Pavithra"].map(
											(name, index) => (
												<li
													key={index}
													className='flex items-center justify-between'>
													<div className='flex items-center space-x-3'>
														<Avatar className='w-8 h-8' />
														<div>
															<p className='text-sm font-semibold'>{name}</p>
														</div>
													</div>
													<Button
														size='sm'
														variant='secondary'>
														Follow
													</Button>
												</li>
											)
										)}
									</ul>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</Card>
				</div>

				{/* Center Content */}
				<div className='w-1/2 space-y-6'>
					{/* Ad Banner */}
					<Card className='p-4 shadow-md bg-gradient-to-r from-red-500 to-red-700 text-white'>
						<h3 className='text-xl font-bold'>₹99 for Barbeque Bliss?</h3>
						<p>Watch Now!</p>
					</Card>

					{/* Food Post */}
					<Card className='p-4 shadow-md bg-white'>
						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-semibold text-lg'>AMBROSIA FOODS</h4>
								<p className='text-xs text-gray-500'>1 min ago • Anna Nagar</p>
							</div>
							<Button
								size='sm'
								variant='secondary'>
								Follow
							</Button>
						</div>
						<img
							src='/food-image.jpg'
							alt='Food'
							className='rounded-md mt-4'
						/>
					</Card>
				</div>

				{/* Right Sidebar */}
				<div className='w-1/4'>
					<Card className='p-4 shadow-md bg-white'>
						<Accordion
							type='single'
							collapsible>
							<AccordionItem value='exclusive'>
								<AccordionTrigger className='text-lg font-bold'>
									KYN Exclusive
								</AccordionTrigger>
								<AccordionContent>
									<div className='space-y-4'>
										{["RA Puram Special", "Sathish X Keerthy Suresh"].map(
											(title, index) => (
												<div
													key={index}
													className='flex items-center'>
													<img
														src='/thumbnail.jpg'
														alt={title}
														className='w-12 h-12 rounded-md mr-4'
													/>
													<div>
														<p className='text-sm font-semibold'>{title}</p>
														<p className='text-xs text-gray-500'>
															11 likes • 240 views
														</p>
													</div>
												</div>
											)
										)}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</Card>
				</div>
			</div>
		</div>
	);
}
