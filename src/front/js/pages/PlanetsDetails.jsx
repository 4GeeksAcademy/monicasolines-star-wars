import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Spinner } from "../component/Spinner.jsx";

export const PlanetDetails = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    // console.log('esto es el params de planes', params);

    useEffect(() => {
        //llamo a actions getCharactersDetails
        actions.getPlanetsDetails(params.id);
    }, [])

    const handleImgError = (event) => {
        console.log(event.target.src)
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"
    }

    return (
        <div className="container">
            <h1> Details </h1>
            {!store.planetDetails.name ?
                <Spinner />
                :
                <div className="card mb-3" style={{ width: "540px" }}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={`https://starwars-visualguide.com/assets/img/planets/${params.id}.jpg`}
                                className="img-fluid rounded-start"
                                alt={store.planetDetails.name}
                                onError={handleImgError}
                            />

                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{store.planetDetails.name}</h5>
                                <p className="card-text">Population: {store.planetDetails.population}</p>
                                <p className="card-text">Terrain: {store.planetDetails.terrain}</p>
                                <p className="card-text">Climate: {store.planetDetails.climate}</p>
                                <p className="card-text">Diameter: {store.planetDetails.diameter}</p>
                                <p className="card-text">Rotation Period: {store.planetDetails.rotation_period}</p>
                                <p className="card-text">Gravity: {store.planetDetails.gravity}</p>
                                <p className="card-text">Orbital Period {store.planetDetails.orbital_period}</p>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}