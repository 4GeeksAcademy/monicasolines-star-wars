import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Spinner } from "../component/Spinner.jsx";

export const CharactersDetails = () => {
    const { store, actions } = useContext(Context)
    const params = useParams();
    // console.log('esto es el params', params);

    useEffect(() => {
        //llamo a actions getCharactersDetails
        actions.getCharactersDetails(params.id);
    }, [])

    const handleImgError = (event) => {
        console.log(event.target.src)
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"
    }


    return (
        <div className="container">
            <h1> Details </h1>
            {!store.characterDetails.name ?
                <Spinner />
                :
                <div className="card mb-3" style={{ width: "540px" }}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={`https://starwars-visualguide.com/assets/img/characters/${params.id}.jpg`}
                                className="img-fluid rounded-start"
                                alt={store.characterDetails.name}
                                onError={handleImgError}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{store.characterDetails.name}</h5>
                                <p className="card-text">Birth Year: {store.characterDetails.birth_year}</p>
                                <p className="card-text">Height: {store.characterDetails.height}</p>
                                <p className="card-text">Mass: {store.characterDetails.mass}</p>
                                <p className="card-text">Gender: {store.characterDetails.gender}</p>
                                <p className="card-text">Hair Color: {store.characterDetails.hair_color}</p>
                                <p className="card-text">Skin: {store.characterDetails.skin_color}</p>
                                <p className="card-text">Homeworld: {store.characterDetails.homeworld}</p>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}