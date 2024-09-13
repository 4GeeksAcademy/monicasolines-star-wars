import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Spinner } from "../component/Spinner.jsx";


export const Planets = () => {
    const { store, actions } = useContext(Context)

    const handleDetails = (id) => {
        actions.getPlanetsDetails(id);
    }

    const handleImgError = (event) => {
        console.log(event.target.src)
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"
    }

    const isFavorite = (characterName) => {
        return store.favorites.some(fav => fav.name === characterName);
    }


    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2">
            {store.planets.length === 0 ? <Spinner /> :
                store.planets.map((item, index) => {
                    return (
                        <div key={index} className="col">
                            <div className="card border-dark rounded my-3 mx-2 text-bg-dark">
                                <img
                                    alt={item.name}
                                    src={`https://starwars-visualguide.com/assets/img/planets/${index + 1}.jpg`}
                                    onError={handleImgError}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {item.name}
                                    </h5>
                                    <div className="d-flex justify-content-between">
                                        <Link
                                            className="btn btn-secondary"
                                            to={`/planets/${item.uid}`}
                                            onClick={() => handleDetails(item.uid)}
                                        >
                                            Details
                                        </Link>
                                        <span
                                            id="buton corazon"
                                            className={isFavorite(item.name) ? "btn btn-warning btn-outline-warning" : "btn btn-outline-warning"}
                                            onClick={() => actions.addFavorite({ name: item.name, type: 'Character' })}
                                        >
                                            {isFavorite(item.name) ?
                                                <i className="fa-solid fa-heart" style={{ color: '#000000' }}></i>
                                                :
                                                <i className="far fa-heart fa-lg"></i>
                                            }
                                        </span>
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