import React, { useContext } from "react";
import { Context } from "../store/appContext";
import starwars from "../../img/StarWars.jpeg";
import "../../styles/home.css";
import { Link } from "react-router-dom";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Welcome To Your Star Wars Page!</h1>
			<p>
				<img src={starwars} style={{ width: "900px"}} />
			</p>
				<Link to ="/dashboard"> <button> Go to Dashboard </button></Link>
		</div>
	);
};
