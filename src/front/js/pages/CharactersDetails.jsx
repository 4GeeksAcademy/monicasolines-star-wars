import React, { useContext, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Context } from "../store/appContext";

export const CharactersDetails = () => {
//     const { store, actions } = useContext(Context)
//     const params = useParams();
//     console.log('esto es el params', params);

//     useEffect(() => {
//         //llamo a actions getCharactersDetails
//         actions.getCharactersDetails(params.id);
//     }, [])

    return (
        <div className="container">
            {/* <h1> Details </h1>
            <div class="card mb-3" style={{ width: "540px" }}>
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src={`https://starwars-visualguide.com/assets/img/characters/${params.id}.jpg`} class="img-fluid rounded-start" alt="..." />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{store.characterDetails.name}</h5>
                            <p class="card-text">Birth Year: {store.characterDetails.birth_year}</p>
                            <p class="card-text">Height: {store.characterDetails.height}</p>
                            <p class="card-text">Mass: {store.characterDetails.mass}</p>
                            <p class="card-text">Gender: {store.characterDetails.gender}</p>
                            <p class="card-text">Hair Color: {store.characterDetails.hair_color}</p>
                            <p class="card-text">Skin: {store.characterDetails.skin_color}</p>
                            <p class="card-text">Homeworld: {store.characterDetails.homeworld}</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}