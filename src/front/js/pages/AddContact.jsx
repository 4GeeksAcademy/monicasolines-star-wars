import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";



export const AddContact = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();
    const [alertVisible, setAlertVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = {
            name: name,
            phone: phone,
            email: email,
            address: address,
        }

        actions.addContact(dataToSend);
        navigate('/contacts')
    }

    const handleReset = () => { }

    useEffect(() => {
        if (store.user.length === 0) {
            setAlertVisible(true);
        }
    }, [store.user]);

    return (
        <div className="container text-secondary w-50">
            <div className="d-flex align-items-center justify-content-between" style={{ display: 'flex' }} >

                <h1 className="text-dark pt-4"> {store.user ? `Add Contacts to ${store.user} 's agenda` : "Add Contacts to agenda"} </h1>
                <Link to="/Contacts" >
                    <button className="btn btn-secondary mt-4" >
                        Go back to contacts
                    </button>
                </Link>
            </div>

            <div className="alert alert-danger" role="alert" style={{ visibility: alertVisible ? 'visible' : 'hidden' }}>
                User doesn't exist! You need to go to Log In and create a username or access an already existing one!
            </div>

            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="InputName" className="form-label">
                        Full Name
                        <span className="text-warning">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputFullName"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputEmail1" className="form-label">
                        Email address
                        <span className="text-warning">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="InputEmail"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="mb-3"><label htmlFor="InputPhone" className="form-label">
                    Phone
                    <span className="text-warning">*</span>
                </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputPhone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputAddress" className="form-label">
                        Address
                        <span className="text-warning">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputAddress"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-warning me-3">
                        Save
                    </button>
                    <button type="reset" onReset={handleReset} className="btn btn-danger">
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    )
}