/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ImageCheck from "./Pages/ImageCheck";
import VideoCheck from "./Pages/VideoCheck";
import FileUpload from "./Pages/uibc/";
import Dashboard from "./Pages/Dashboard";
//import ModLog from "./Pages/ModLog";
import ModAnalysis from "./Pages/ModAnalysis";
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
					<Route
						path='/FileUpload'
						element={<FileUpload />}
					/>
					<Route
						path='/Dashboard/Mod-log'
						element={<Dashboard />}
					/>

					<Route
						path='/Dashboard/Mod-analysis'
						element={<ModAnalysis />}
					/>
				</Routes>
			</Router>
		</>
	);
};

export default App;
