import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Spinner } from "../component/Spinner.jsx";

export const Starships = () => {
    const { store, actions } = useContext(Context)

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2">
            {store.starships.length === 0 ? <Spinner /> :
                store.starships.map((item, index) => {
                    return (
                        <div key={index} className="col">
                            <div className="card border-dark rounded my-3 mx-2 text-bg-dark">
                                <img
                                    alt={item.name}
                                    src={`https://starwars-visualguide.com/assets/img/starships/${item.uid}.jpg`}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {item.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}