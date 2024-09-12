import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo1.png";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store, actions} = useContext(Context)

	return (
		<nav className="navbar navbar-dark bg-dark" style={{ background: 'transparent' }}>
			<div className="container" >
				<Link to="/">
					<span className="navbar-brand mb-0 h1"> <img src={logo} alt="logo" style={{ width: '120px', height: '70px' }} /> </span>
				</Link>
				<ul className="navbar-nav" >
					<div className="ml-auto" style={{ display: 'inline-flex' }}>
						<Link to="/characters" className="nav-link text-light m-3">
							Characters
						</Link>
						<Link to="/planets" className="nav-link text-light m-3">
							Planets
						</Link>
						<Link to="/starships" className="nav-link text-light m-3">
							Starships
						</Link>
						<Link to="/contacts" className="nav-link text-light m-3">
							Contacts
						</Link>
						<li className="nav-item dropdown">
							<Link className="nav-link dropdown-toggle text-light m-3" to="/demo" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								Dropdown
							</Link>
							<ul className="dropdown-menu " aria-labelledby="navbarDropdown">
								<li><a className="dropdown-item" href="#">en este li va un map del array favorites</a></li>
							</ul>
						</li>
						{store.username.length === 0 ? 
						<Link to="/login" className="btn btn-success pe-3 ps-3 nav-link text-light m-3">
							Log In
						</Link>
						:
						<button className="btn btn-danger pe-3 ps-3 nav-link text-light m-3"
						onClick={() => actions.clearUsername()}
						>
							Log out
						</button>
						}
					</div>
				</ul>

			</div>
		</nav>
	);
};
