import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import starwars from "../../img/StarWars.jpeg";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);

  const handleOnClick = () => {
    actions.accessProtected()
  }

  return (
    <div className="text-center mt-5 mb-5">
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
        <img src={starwars} style={{ width: "900px" }} />
      </p>
      <button className="btn btn-warning" onClick={handleOnClick}>
        Acceso a Protected
      </button>
      <button className="btn btn-success" onClick={() => actions.getPosts()}>
        Get Posts
      </button>
      <div>
        {store.posts.map((item) => {
          return (
            <div key={item.id} className="card mt-3 mb-3 d-flex justify-content-between">
              <div className="row g-0 bg-secondary bg-opacity-10">
                <div className="col-md-3 p-2 position-relative">
                  <div className="d-none d-md-block position-absolute top-50 start-50 translate-middle">
                  </div>
                </div>
                <div className="col-md-7 p-2 text-start">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">
                      <strong> Date: </strong> {item.date}
                      <br></br>
                      <strong> Description: </strong>  {item.description}
                      <br></br>
                      <strong> Body: </strong> {item.body}
                      <br></br>
                      <strong> image_url: </strong>  {item.image_url}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}