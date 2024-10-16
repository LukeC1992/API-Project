import { csrfFetch } from "./csrf";

const CREATE_SPOT = 'spots/createSpot' //C
const GET_SPOTS = 'spots/getSpots';    //R
const UPDATE_SPOT = 'spots/updateSpot' //U
const DELETE_SPOT = 'spots/deleteSpot' //D

const createSpot = (spot) => {
      return {
            type: CREATE_SPOT,
            payload: spot,
      }
}

const getSpots = (data) => {
      return {
            type: GET_SPOTS,
            payload: data
      }
}

const updateSpot = (spot) => {
      return {
            type: UPDATE_SPOT,
            payload: spot
      }
}

const deleteSpot = (id) => {
      return {
            type: DELETE_SPOT,
            payload: id
      }
}

export const createNewSpot = (spot) => async (dispatch) => {
      const response = await csrfFetch('/api/spots', {
            method: 'POST',
            body: JSON.stringify(spot)
      })
      const data = await response.json()
      dispatch(createSpot(data))
      return data;
}

export const loadSpots = () => async (dispatch) => {
      const response = await csrfFetch('/api/spots')
      const data = await response.json();
      dispatch(getSpots(data.Spots));
      return data;
}

export const updateCurrentSpot = (spot, id) => async (dispatch) => {
      const response = await csrfFetch(`/api/spots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(spot)
      });
      const data = await response.json();
      dispatch(updateSpot(data))
      return data;
}

export const deleteCurrentSpot= (id) => async (dispatch) => {
      const response = await csrfFetch(`/api/spots/${id}`,{
            method: 'DELETE',
      });
      const data = await response.json();
      dispatch(deleteSpot(id));
      return data;
}


export default function spotReducer (state = [], action) {
  switch (action.type) {
      case CREATE_SPOT: {
            return [...state, action.payload]
      }
      case GET_SPOTS: {
            return [...action.payload]
      }
      case UPDATE_SPOT: {
            const newState = [...state]
            newState[action.payload.id] = action.payload;
            return newState;
      }
      case DELETE_SPOT: {
            const newState = [...state]
            const spot = newState.find((spot)=>spot.id===action.payload)
            delete newState[newState.indexOf(spot)]
            return newState
      }

    default:
      return state;
  }
}
