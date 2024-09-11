import React from "react";
import { Link } from "react-router-dom";

export const Modal = () => {

    return (
        <div className="modal" tabindex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>You need to create a User First!!!</p>
                    </div>
                    <div className="modal-footer">
                        <Link to="/login">
                            <button type="button" className="btn btn-primary">
                                Go to Log In
                            </button>
                        </Link>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}