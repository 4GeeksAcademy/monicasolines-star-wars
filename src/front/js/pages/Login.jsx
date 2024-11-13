import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { store, actions } = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const navigate = useNavigate();

    const handleEmail = (event) => setEmail(event.target.value)
    const handlePassword = (event) => setPassword(event.target.value)

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { email, password }
        console.log(dataToSend);
        actions.login(dataToSend, navigate);
    }

    return (
        <div className="container bg-light mt-5 rounded col-4 m-auto" >
            {store.alerta?.visible && (
                        <div
                            className={`alert alert-${store.alerta.background}`}
                            role="alert"
                        >
                            {store.alerta.text}
                        </div>
                    )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Login</label>
                    <input
                        type="email"
                        className="form-control"
                        id="InputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        placeholder="Email"
                        onChange={handleEmail}
                    />
                </div>
                <div className="input-group mb-3">
                    <input type={hidePassword ? "password" : 'text'} className="form-control" aria-label="Password" placeholder="Password"
                        value={password} onChange={handlePassword} />
                    <span onClick={() => setHidePassword(!hidePassword)} className="input-group-text">
                        {hidePassword ? <i className="far fa-eye"></i> : <i className="far fa-eye-slash"></i>}
                    </span>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>

    )
}