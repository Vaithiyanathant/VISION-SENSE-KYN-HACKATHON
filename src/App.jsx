/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ImageCheck from "./Pages/ImageCheck";
import VideoCheck from "./Pages/VideoCheck";
const App = () => {
	return (
		<>
			<Router>
				<Routes>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route
						path='/Image'
						element={<ImageCheck />}
					/>
					<Route
						path='/video'
						element={<VideoCheck />}
					/>
				</Routes>
			</Router>
		</>
	);
};

export default App;
