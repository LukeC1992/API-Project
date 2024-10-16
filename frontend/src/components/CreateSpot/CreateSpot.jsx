import SubmitSpot from "../SubmitSpot/SubmitSpot";
import './CreateSpot.css'

export default function CreateSpot() {


  return <div className="center">
      <div className="createSpot">
      <h1>Create a new Spot</h1>
      <h3>Where&apos;s your place located?</h3>
      <p>Guests will only get your exact address once they have booked a reservation.</p>
      </div>
      <SubmitSpot />
  </div>;
}
