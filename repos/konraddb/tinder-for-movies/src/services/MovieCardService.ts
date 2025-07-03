import axios from "axios";
import { EActionType } from "../enums/ActionType";
import IMoveCardData from "../types/MovieCard";

const baseUrl = "/tinder-for-movies/recommendations";

const getAll = () => {
  return axios.get<IMoveCardData[]>(`${baseUrl}/movie-card.json`);
};

const rejectOrAcceptById = (
  id: string | undefined,
  actionType: EActionType
) => {
  return axios.put<EActionType[]>(`${baseUrl}/${id}/${actionType}`);
};

const MovieCardDataService = {
  getAll,
  rejectOrAcceptById,
};

export default MovieCardDataService;
