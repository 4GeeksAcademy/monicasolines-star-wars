import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const ButtonFavorites = () => {
    const { store, actions } = useContext(Context);

    return (

        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Favorite
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {store.favorites.length}
                </span>
            </button>

            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">

                {store.favorites.length === 0 ?
                    <li>
                        <span className="dropdown-item"> No tienes ningun favorito </span>
                    </li>
                    :
                    store.favorites.map((item, index) => (
                        <li key={index}>
                            {item.name} {item.type}
                            <span onClick={() => actions.removeFavorite(item)} className="dropdown-item">
                                <button className="btn btn-light">
                                    <i className="fas fa-trash text-danger"></i>
                                </button>
                            </span>
                        </li>
                    ))}
            </ul>
        </div>

    )
}