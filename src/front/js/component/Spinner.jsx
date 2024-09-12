import React from "react";

export const Spinner = () => {

    return (
        <div className="container">
            <div className="d-flex justify-content-center align-content-center m-3 text-danger"> 
            <strong>Loading...</strong>
            <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            </div>
        </div>
    )
}