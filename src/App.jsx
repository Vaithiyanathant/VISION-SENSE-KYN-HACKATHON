/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import FileUpload from "./Pages/FileUpload";
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
						path='/FileUpload'
						element={<FileUpload />}
					/>
				</Routes>
			</Router>
		</>
	);
};

export default App;
