import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteCurrentSpot } from "../../store/spots";
import "./DeleteSpotModal.css";

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSpot = async () => {
    await dispatch(deleteCurrentSpot(spotId));
    closeModal();
  };

  return (
    <div className="deleteSpotModal">
      <h1>Confirm Delete</h1>

      <button className="yes" onClick={deleteSpot}>
        Yes (Delete Spot)
      </button>

      <button className="no" onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
}
