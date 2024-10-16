import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadSpots } from "../../store/spots";
import { useNavigate } from "react-router";
import './ManageSpots.css'

export default function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  const user = useSelector((state)=>state.session.user)
  const allSpots = useSelector((state)=>state.spots)
  const ownedSpots = allSpots.filter((spot)=>spot.ownerId===user.id)

  const createSpot = () => {
    navigate("/spots/new");
  };

  return (
    <div className="manageSpots">
      <h1 className="title">Manage Spots</h1>
      {ownedSpots.length>0 ? null : (
        <button className="newSpot" onClick={createSpot}>
          Create a New Spot
        </button>
      )}
    </div>
  );
}
