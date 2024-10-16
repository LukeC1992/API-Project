import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { postReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";

export default function ReviewModal({ spotId }) {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  const [hover, setHover] = useState(1);
  // const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      review,
      stars,
    };

    await dispatch(postReview(payload, spotId))
      .then(closeModal)
  };

  return (
    <div className="reviewModal">
      <form className="reviewModalForm">
        <h1>How was your stay?</h1>
        <textarea
          id="review"
          className="reviewTextArea"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="stars">
          <FaStar
            className={hover >= 1 ? "orange" : "black"}
            type="radio"
            value={1}
            onClick={() => setStars(1)}
            onMouseEnter={() => setHover(1)}
            onMouseLeave={() => setHover(stars)}
          />
          <FaStar
            className={hover >= 2 ? "orange" : "black"}
            type="radio"
            value={2}
            onClick={() => setStars(2)}
            onMouseEnter={() => setHover(2)}
            onMouseLeave={() => setHover(stars)}
          />
          <FaStar
            className={hover >= 3 ? "orange" : "black"}
            type="radio"
            value={3}
            onClick={() => setStars(3)}
            onMouseEnter={() => setHover(3)}
            onMouseLeave={() => setHover(stars)}
          />
          <FaStar
            className={hover >= 4 ? "orange" : "black"}
            type="radio"
            value={4}
            onClick={() => setStars(4)}
            onMouseEnter={() => setHover(4)}
            onMouseLeave={() => setHover(stars)}
          />
          <FaStar
            className={hover > 4 ? "orange" : "black"}
            type="radio"
            value={5}
            onClick={() => setStars(5)}
            onMouseEnter={() => setHover(5)}
            onMouseLeave={() => setHover(stars)}
          />
          <span> Stars {stars}</span>
        </div>
        <button onClick={handleSubmit} disabled={review.length < 10}>
          Submit your Review
        </button>
      </form>
    </div>
  );
}
