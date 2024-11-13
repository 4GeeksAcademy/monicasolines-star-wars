import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

export const EditContacts = () => {
    const { store, actions } = useContext(Context);
    const currentContact = store.currentContact;
    const [name, setName] = useState(currentContact.name);
    const [phone, setPhone] = useState(currentContact.phone);
    const [email, setEmail] = useState(currentContact.email);
    const [address, setAddress] = useState(currentContact.address);
    const editContact = store.currentContact;
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = {
            name: name,
            phone: phone,
            email: email,
            address: address,
        }

        actions.editContacts(editContact.id, dataToSend);
       
        navigate('/contacts')
    }

    const handleReset = () => { navigate('/contacts') };

    return (
        <div className="container text-secondary w-50">
            <h1 className="text-dark pt-4">Edit Contact</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="InputFullName" className="form-label">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputFullName"
                        aria-describedby="emailHelp"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="InputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPhone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputPhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputAddress" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="InputAddress"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-warning me-3">
                        Save
                    </button>
                    <button type="reset" onClick={handleReset} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}