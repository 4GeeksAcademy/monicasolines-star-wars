import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Spinner } from "../component/Spinner.jsx";

export const StarshipDetails = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    // console.log('esto es el params de starhips', params);

    useEffect(() => {
        //llamo a actions getCharactersDetails
        actions.getStarshipsDetails(params.id);
    }, [])

    const handleImgError = (event) => {
        console.log(event.target.src)
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"
    }

    return (
        <div className="container">
            <h1> Details </h1>
            {!store.starshipDetails.name ?
                <Spinner />
                :
                <div className="card mb-3" style={{ width: "540px" }}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={`https://starwars-visualguide.com/assets/img/starships/${params.id}.jpg`}
                                className="img-fluid rounded-start"
                                alt={store.starshipDetails.name}
                                onError={handleImgError}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{store.starshipDetails.name}</h5>
                                <p className="card-text">Model: {store.starshipDetails.model}</p>
                                <p className="card-text">Starship class: {store.starshipDetails.starship_class}</p>
                                <p className="card-text">Manufacturer: {store.starshipDetails.manufacturer}</p>
                                <p className="card-text">Cost in credits: {store.starshipDetails.cost_in_credits}</p>
                                <p className="card-text">Length: {store.starshipDetails.length}</p>
                                <p className="card-text">Crew: {store.starshipDetails.crew}</p>
                                <p className="card-text">Passengers: {store.starshipDetails.passengers}</p>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}