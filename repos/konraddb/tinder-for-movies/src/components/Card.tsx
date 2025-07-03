import React from "react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import IMoveCardData from "../types/MovieCard";

const Card: React.FC<IMoveCardData> = (props) => {
  return (
    <div className="cellphone-container">
      <div className="movie">
        <div
          className="movie-img"
          style={{ backgroundImage: `url(${props.imageURL})` }}
        ></div>
        <div className="text-movie-cont">
          <div className="mr-grid">
            <div className="col1">
              <h1>{props.title}</h1>
              <ul className="movie-gen">
                <li>16 yo /</li>
                <li>1h 45min /</li>
                <li>Adventure, Drama, Sci-Fi</li>
              </ul>
            </div>
          </div>
          <div className="mr-grid summary-row">
            <div className="col2">
              <h5>SUMMARY</h5>
            </div>
            <div className="col2">
              <ul className="movie-likes">
                <li>
                  Rating:
                  {props.rating}
                </li>
              </ul>
            </div>
          </div>
          <div className="mr-grid">
            <div className="col1">
              <p className="movie-description">{props.summary}</p>
            </div>
          </div>
          <div className="mr-grid actors-row">
            <div className="col1">
              <p className="movie-actors">
                Chris Evans, Robert Downey, Channing Tatum
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
