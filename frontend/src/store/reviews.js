import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/getReviews';
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';

const getReviews = (reviews) => {
      return {
            type: GET_REVIEWS,
            payload: reviews
      }
}

const createReview = (review) => {
      return {
            type: CREATE_REVIEW,
            payload: review
      }
}

const deleteReview = (id) => {
      return {
            type: DELETE_REVIEW,
            payload: id
      }
}

export const loadReviews = (spotId) => async (dispatch) => {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
      const data = await response.json()
      dispatch(getReviews(data));
      return data;
}

export const postReview = (review, spotId) => async (dispatch) => {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`,{
            method: 'POST',
            body: JSON.stringify(review)
      })
      const data = await response.json()
      dispatch(createReview(data))
      return data;
}

export const deleteCurrentReview= (id) => async (dispatch) => {
      const response = await csrfFetch(`/api/reviews/${id}`,{
            method: 'DELETE',
      });
      const data = await response.json();
      dispatch(deleteReview(id));
      return data;
}

export default function reviewsReducer (state=[], action) {
      switch(action.type){
            case CREATE_REVIEW: {
                  return [...state, action.payload]
            }
            case GET_REVIEWS: {
                  return [...action.payload.Reviews]
            }
            case DELETE_REVIEW: {
                  const newState = [...state]
                  const review = newState.find((review)=>review.id===action.payload)
                  delete newState[newState.indexOf(review)]
                  return newState
            }
            default:
                  return state; 
      }
}