import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


export const Login = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState('')
    const navigate = useNavigate();
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const handleSubmit = (event) => {
        event.preventDefault();
        if (username.includes(' ')) {
            username = username.replace(/\s/g, '');
        }
        actions.getUsername(username);
        localStorage.setItem('username', username);

        const loginData = {
            slug: username,
            id: randomId,
        }
        actions.createAgenda(loginData);

        navigate('/contacts');

        actions.getContacts(username);
    }




    return (
        <div className="container bg-light mt-5 rounded col-4 m-auto" >
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputEmail1"
                        aria-describedby="emailHelp"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="InputPassword" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>

    )
}