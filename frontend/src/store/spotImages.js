import { csrfFetch } from "./csrf";

const CREATE_SPOT_IMAGE = "spotImages/createSpotImage";

const createSpotImage = (spotImage) => {
  return {
    type: CREATE_SPOT_IMAGE,
    payload: spotImage,
  };
};

export const postSpotImage = (spotImage, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(spotImage),
  });
  const data = await response.json();
  dispatch(createSpotImage(data));
  return data;
};

export default function spotImageReducer(state = [], action) {
  switch (action.type) {
    case CREATE_SPOT_IMAGE: {
      return [...state, action.payload];
    }
    default:
      return state;
  }
}
