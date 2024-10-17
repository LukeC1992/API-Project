import SubmitSpot from "../SubmitSpot/SubmitSpot";
import "./CreateSpot.css";

export default function CreateSpot() {
  return (
    <div className="center">
      <div className="createSpot"  data-testid="section-1">
        <h1 data-testid="form-title">Create a new Spot</h1>
        <h3 data-testid="section-1-heading">
          Where&apos;s your place located?
        </h3>
        <p data-testid="section-1-caption">
          Guests will only get your exact address once they have booked a
          reservation.
        </p>
      </div>
      <SubmitSpot />
    </div>
  );
}
