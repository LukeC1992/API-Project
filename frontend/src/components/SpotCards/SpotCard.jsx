import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadSpots } from "../../store/spots";
import { useNavigate } from "react-router";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import "./SpotCard.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

export default function SpotCard({ current }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  const user = useSelector((state) => state.session.user);
  const allSpots = useSelector((state) => state.spots);
  const ownedSpots = allSpots.filter((spot) => spot?.ownerId === user?.id);
  console.log("O", ownedSpots);
  const spots = current ? ownedSpots : allSpots;
  //
  const updateSpot = (e, spotId) => {
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  };

  if (!allSpots) return <h1>Loading Spots</h1>;
  return (
    <div className="allSpots">
      <ul className="spotCards" data-testid="spots-list">
        {spots.map((spot) => (
          <li
            key={spot.id}
            className="spot"
            title={spot.name}
            data-testid="spot-tile"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/spots/${spot.id}`);
            }}
          >
            <img
              className="spotImage"
              data-testid="spot-thumbnail-image"
              src={spot.previewImage}
              alt="Image not found"
              title={spot.name}
            />
            <div className="spotInfo">
              <div className="locationRating">
                <span data-testid="spot-city">
                  {spot.city}, {spot.state}
                </span>
                {spot.avgRating ? (
                  <span data-testid="spot-rating">★ {spot.avgRating}</span>
                ) : (
                  <span className="new">★ New!</span>
                )}
              </div>
              <div className="price">
                <span data-testid="spot-price">${spot.price} night</span>
              </div>
              {current && (
                <div className="updateDelete">
                  <div>
                    <button
                      className="updateDeleteButtons"
                      onClick={(e) => updateSpot(e, spot.id)}
                    >
                      Update
                    </button>
                  </div>
                  <div className="deleteButtons">
                    <OpenModalButton
                      modalComponent={<DeleteSpotModal spotId={spot.id}  data-testid="delete-spot-modal"/>}
                      buttonText={"Delete"}
                    />
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
