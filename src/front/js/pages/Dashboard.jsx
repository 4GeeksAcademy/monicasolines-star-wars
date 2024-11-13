import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import starwars from "../../img/StarWars.jpeg";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);

  const handleOnClick = () => {
    actions.accessProtected()
  }

  return (
    <div className="text-center mt-5">
			<h1>Welcome To Your Star Wars Page!</h1>
      {store.alert?.visible && (
        <div
          className={`alert alert-${store.alert.background}`}
          role="alert"
        >
          {store.alert.text}
        </div>
      )}
			<p>
				<img src={starwars} style={{ width: "900px"}} />
			</p>
      <button className="btn btn-warning" onClick={handleOnClick}>
          Acceso a Protected
      </button>
      <button className="btn btn-success" onClick={() => actions.getPosts()}>
          Get Posts
      </button>
    </div>
  )
}