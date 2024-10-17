import { useParams } from "react-router";
import { loadSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./SpotDetails.css";
import Reviews from "../Reviews/Reviews";

export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  const spot = useSelector((state) =>
    state.spots.find((spot) => spot.id === Number(spotId))
  );

  if (!spot) return <h1>Spot Loading</h1>;
  return (
    <div className="spotDetails">
      <h2 data-testid="spot-name">{spot.name}</h2>
      <h3 data-testid="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </h3>
      <div className="pictures">
        <div>
          <img
            src={spot.previewImage}
            className="previewImage"
            data-testid="spot-large-image"
          ></img>
        </div>
        <div className="spotImages">
          {spot.SpotImages &&
            spot.SpotImages.map((image) => (
              <img
                key={image.id}
                className="images"
                src={image.url}
                data-testid="spot-small-image"
              />
            ))}
        </div>
      </div>
      <div className="spotDescription">
        <div>
          <h3 data-testid="spot-host">
            Hosted by {spot?.Owner && spot.Owner.firstName}{" "}
            {spot?.Owner && spot.Owner.lastName}
          </h3>
          <p data-testid="spot-description">{spot && spot.description}</p>
        </div>
        <div className="reserve">
          <div className="priceRating" data-testid="spot-callout-box">
            <span data-testid="spot-price">${spot.price} night</span>
            {spot.avgRating ? (
              <span data-testid="reviews-heading">
                ★{spot.avgRating} &#x2022;{" "}
                {spot.numReviews === 1 ? (
                  <span data-testid="review-count">1 Review</span>
                ) : (
                  <span data-testid="review-count">
                    {spot.numReviews} Reviews
                  </span>
                )}
              </span>
            ) : (
              <span  data-testid="reviews-heading">★ New!</span>
            )}
          </div>
          <button
            className="reserveButton"
            data-testid="reserve-button"
            onClick={() => window.alert("Feature Coming Soon...")}
          >
            Reserve
          </button>
        </div>
      </div>
      <Reviews />
    </div>
  );
}
