import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteCurrentReview } from "../../store/reviews";
import './DeleteReviewModal.css'

export default function DeleteReviewModal ({reviewId}) {

      const dispatch = useDispatch();
      const { closeModal } = useModal();
    
      const deleteReview = async () => {
        await dispatch(deleteCurrentReview(reviewId));
        closeModal();
      };
    
      return (
        <div className="deleteReviewModal">
          <h1>Confirm Delete</h1>
    
          <button className="yes" onClick={deleteReview}>
            Yes (Delete Review)
          </button>
    
          <button className="no" onClick={closeModal}>
            No (Keep Review)
          </button>
        </div>
      );
}