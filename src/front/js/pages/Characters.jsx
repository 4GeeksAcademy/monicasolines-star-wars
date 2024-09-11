import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";


export const Characters = () => {
    const { store, actions } = useContext(Context)


    // useEffect(() => {
    //     // Llamada a la función getCharacters
    //     actions.getCharacters();
    // }, []);

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2">
            {store.characters.map((item, index) => {
                return (
                    <div key={index} className="col">
                        <div className="card border-dark rounded my-3 mx-2 text-bg-dark">
                            <img
                                alt={item.name}
                                src={item.url}
                            />
                            <div className="card-body">
                                <h5 className="card-title">
                                    {item.name}
                                </h5>
                                <div className="d-flex justify-content-between">
                                    <Link className="btn btn-secondary" to="/characters/1">
                                        Details
                                    </Link>
                                    <Link className="btn btn-outline-warning" to="/characters">
                                        <i className="far fa-heart fa-lg">
                                        </i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}
