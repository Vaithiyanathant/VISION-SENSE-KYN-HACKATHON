/** @format */

import React from "react";
import { Button } from "../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const FileTypeDropdown = ({ onTypeSelect }) => {
	const handleSelect = (type) => {
		onTypeSelect(type); // Notify parent of the selected type
	};

	return (
		<div className='absolute top-4 left-4'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						className='text-left w-48'>
						Select File Type
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-48'>
					<DropdownMenuItem onClick={() => handleSelect("Image")}>
						Image
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleSelect("Video")}>
						Video
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleSelect("Text")}>
						Text
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleSelect("Live Streaming")}>
						Live Streaming
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default FileTypeDropdown;
