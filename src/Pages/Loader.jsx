/** @format */

import React from "react";

const Loader = () => {
	return (
		<div className='loader flex items-center justify-center'>
			<span className='loader-text text-[#f15656] text-sm font-medium'>
				loading
			</span>
			<span className='load bg-[#f15656] relative rounded-full'></span>
		</div>
	);
};

export default Loader;
