import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadReviews } from "../../store/reviews";
import { useParams } from "react-router";
import { loadSpots } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

import "./Reviews.css";

export default function Reviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviews = useSelector((state) => state.reviews);
  const spot = useSelector((state) =>
    state.spots.find((spot) => spot.id === Number(spotId))
  );
  const sessionUser = useSelector((state) => state.session.user);
  const userId = sessionUser?.id;
  const existingReview = reviews.find((review) => review?.User.id === userId);
  const reviewCheck = spot.Owner.id !== userId && !existingReview;

  useEffect(() => {
    dispatch(loadReviews(Number(spotId)));
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  if (!reviews) return <h1>Reviews Loading</h1>;
  if (reviews.length === 0 && !sessionUser)
    return (
      <div>
        <h2>Login to be the first to post a review!</h2>
        <ul data-testid="review-list">
          {reviews.map((review) => (
            <li key={review.id} data-testid="review-item">
              <h2 className="reviwerName">{review.User.firstName}</h2>
              <h4 className="reviewDate" data-testid="review-date">
                {review.createdAt.slice(5, 7)}-{review.createdAt.slice(0, 4)}
              </h4>
              <p className="reviewDescription">{review.review}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  if (reviews.length === 0 && sessionUser.id !== spot.ownerId)
    return (
      <div className="newReview">
        {reviewCheck && (
          <>
            <OpenModalButton
              modalComponent={<ReviewModal spotId={spotId} />}
              buttonText={"Post your review"}
            />
            <h3>Be the first to post a review!</h3>
          </>
        )}
      </div>
    );
  return (
    <div className="reviews">
      <h2>
        ★ {spot.avgRating} &#x2022;
        {reviews.length === 1 ? "1 Review" : ` ${reviews.length} Reviews`}
      </h2>
      <div className="newReview">
        {reviewCheck && (
          <>
            <OpenModalButton
              data-testid="delete-review-modal"
              modalComponent={<ReviewModal spotId={spotId} />}
              buttonText={"Post your review"}
            />
            <h3>Be the first to post a review!</h3>
          </>
        )}
      </div>
      <div className="reviewCard">
        <ul data-testid="review-list">
          {reviews.map((review) => (
            <li key={review.id} data-testid="review-item">
              <h2 className="reviwerName">{review.User.firstName}</h2>
              <h4 className="reviewDate" data-testid="review-date">
                {review.createdAt.slice(5, 7)}-{review.createdAt.slice(0, 4)}
              </h4>
              <p className="reviewDescription">{review.review}</p>
              {review.userId === userId && (
                <OpenModalButton
                  data-testid="review-button"
                  modalComponent={<DeleteReviewModal reviewId={review.id} />}
                  buttonText={"Delete"}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
