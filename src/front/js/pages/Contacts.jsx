import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";



export const Contacts = () => {
    const { store, actions } = useContext(Context);
    const [alertVisible, setAlertVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.username.length === 0) {
            setAlertVisible(true);
        }
    }, [store.username]);

    const editContacts = async (itemContact) => {
        actions.setCurrentContact(itemContact)
        navigate('/edit-contacts');
    }

    const deleteContact = (id) => {
        actions.deleteContact(id);
    }

    return (
        < div className="container bg-dark mb-3 pb-4" >
            <div className="navbar navbar-dark bg-dark">
                <h1 className="text-light pt-4">
                    {store.user ? `Contacts of ${store.user}'s agenda` : "Contacts"}
                </h1>
                <Link to="/add-contact">
                    <button className="btn btn-secondary mt-4">
                        Add Contact
                    </button>
                </Link>

            </div>
            {/* <div className="alert alert-danger m-3 d-flex justify-content-center align-content-center text-center mb-4" role="alert" style={{ visibility: alertVisible ? 'visible' : 'hidden' }}>
                You need to access to a contact first! Go to Log In and create a username or access an already existing one!
            </div> */}
            <div>
                {store.singleAgenda.map((item) => {
                    return (
                        <div key={item.id} className="card mb-3 d-flex justify-content-between">
                            <div className="row g-0 bg-secondary bg-opacity-10">
                                <div className="col-md-3 p-2 position-relative">
                                    <div className="d-none d-md-block position-absolute top-50 start-50 translate-middle">
                                        <img src=" " className="img-fluid rounded-start" alt="Star Wars - Soldier" />
                                    </div>
                                </div>
                                <div className="col-md-7 p-2 text-start">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text">
                                            <i className="fa-solid fa-location-dot"></i>
                                            {item.address}
                                            <br></br>
                                            <i className="fa-solid fa-phone"></i>
                                            {item.phone}
                                            <br></br>
                                            <i className="fa-solid fa-envelope"></i>
                                            {item.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-2 p-2 text-end">
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-evenly">
                                            <Link to="/edit-contact" >
                                                <button type="button" className="btn btn-secondary" onClick={() => editContacts(item)} >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                            </Link>
                                            <button type="button" className="btn btn-danger" onClick={() => deleteContact(item.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )

    {/* </div>
            <ul>
                <div className="card mb-3 d-flex justify-content-between">
                    <div className="row g-0 bg-secondary bg-opacity-10">
                        <div className="col-md-3 p-2 position-relative">
                            <div className="d-none d-md-block position-absolute top-50 start-50 translate-middle">
                                <img src="./star-wars-soldier.jpeg" className="img-fluid rounded-start" alt="Star Wars - Soldier" />
                            </div>
                        </div>
                        <div className="col-md-7 p-2 text-start">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Leticia
                                </h5>
                                <p className="card-text">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" className="svg-inline--fa fa-location-dot " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z">
                                        </path>
                                    </svg>
                                    Alta Gracia, Argentina
                                    <br></br>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" className="svg-inline--fa fa-phone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z">
                                        </path>
                                    </svg>
                                    +5491321321
                                    <br></br>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" className="svg-inline--fa fa-envelope " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z">
                                        </path>
                                    </svg>
                                    leticia@gmail.com
                                </p>
                            </div>
                        </div>
                        <div className="col-md-2 p-2 text-end">
                            <div className="mt-3">
                                <div className="d-flex justify-content-evenly">
                                    <a className="btn btn-secondary" href="/contacts/15">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" className="svg-inline--fa fa-pen " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z">
                                            </path>
                                        </svg>
                                    </a>
                                    <button type="button" className="btn btn-danger"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-can" className="svg-inline--fa fa-trash-can " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z">
                                        </path>
                                    </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        </div > 
    ) */}
}