import { loadSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router";
import SubmitSpot from "../SubmitSpot/SubmitSpot";
import "./EditSpot.css";

export default function EditSpot() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  const { spotId } = useParams();
  const spots = useSelector((state) => state.spots);
  const spot = spots.find((spot) => spot.id === Number(spotId));

  return (
    <div className="center">
      <div className="editSpot">
        <h1>Update a new Spot</h1>
        <h3>Where&apos;s your place located?</h3>
        <p>
          Guests will only get your exact address once they have booked a
          reservation.
        </p>
      </div>
      <SubmitSpot spot={spot} />
    </div>
  );
}
