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
      <h2>{spot.name}</h2>
      <h3>
        {spot.city}, {spot.state}, {spot.country}
      </h3>
      <div className="pictures">
        <div>
          <img src={spot.previewImage} className="previewImage"></img>
        </div>
        <div className="spotImages">
            {spot.SpotImages && spot.SpotImages.map((image) => (
                <img key={image.id} className="images" src={image.url} />
            ))}
        </div>
      </div>
      <div className="spotDescription">
        <div>
          <h3>
            Hosted by {spot?.Owner && spot.Owner.firstName} {spot?.Owner && spot.Owner.lastName}
          </h3>
          <p>{spot && spot.description}</p>
        </div>
        <div className="reserve">
          <div className="priceRating">
            <span>${spot.price} night</span>
            {spot.avgRating ? (
              <span>
                ★{spot.avgRating} &#x2022;{" "}
                {spot.numReviews === 1 ? (
                  <span>1 Review</span>
                ) : (
                  <span>{spot.numReviews} Reviews</span>
                )}
              </span>
            ) : (
              <span>★ New!</span>
            )}
          </div>
          <button
            className="reserveButton"
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
