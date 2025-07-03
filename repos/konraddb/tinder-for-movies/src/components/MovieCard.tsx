import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MovieCardDataService from "../services/MovieCardService";
import IMoveCardData from "../types/MovieCard";
import { EActionType } from "../enums/ActionType";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import Card from "./Card";
import { AxiosResponse } from "axios";

const MovieCard: React.FC = () => {
  const [movieCard, setMovieCard] = useState<Array<IMoveCardData>>([]);
  const [currentMovieCard, setCurrentMovieCard] = useState<IMoveCardData>();
  const [swiperInstance, setSwiperInstance] = useState<any>();

  useEffect(() => {
    getMovieCard();
  }, []);

  const getMovieCard = () => {
    MovieCardDataService.getAll().then(
      (response: AxiosResponse<IMoveCardData[]>) => {
        setMovieCard(response.data);
        setCurrentMovieCard(response.data[0]);
      }
    );
  };

  const sendSelectionResult = (
    actionType: EActionType,
    onButtonClick: boolean
  ) => {
    const currentIndex = swiperInstance.realIndex + 1;
    setCurrentMovieCard(movieCard[currentIndex]);
    MovieCardDataService.rejectOrAcceptById(currentMovieCard?.id, actionType);
    return onButtonClick ? swiperInstance.slideTo(currentIndex) : true;
  };

  return (
    <div className="container pt-5 pb-5">
      <div className="row justify-content-md-center">
        <div className="col-12 col-lg-4">
          <Swiper
            onSwiper={setSwiperInstance}
            onSliderFirstMove={() =>
              sendSelectionResult(EActionType.REJECT, false)
            }
            allowSlidePrev={false}
          >
            {movieCard.map((elem, i) => {
              return (
                <SwiperSlide key={i}>
                  <Card {...elem}></Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="button-container">
            <Button
              size="medium"
              variant="contained"
              color="success"
              onClick={() => sendSelectionResult(EActionType.ACCEPT, true)}
            >
              Accept
            </Button>
            <Button
              size="medium"
              variant="outlined"
              color="error"
              onClick={() => sendSelectionResult(EActionType.REJECT, true)}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
