import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createNewSpot, updateCurrentSpot } from "../../store/spots";
import { postSpotImage } from "../../store/spotImages";
// import { states } from "./states";
// import { countries } from "./countries";
import "./SubmitSpot.css";

export default function SubmitSpot({ spot }) {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {spotId} = useParams();

  console.log("spot", spot);

  useEffect(() => {
    if (spot) {
      console.log(spot);
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLat(spot.lat);
      setLng(spot.lng);
      setName(spot.name);
      setDescription(spot.description);
      setPrice(spot.price);
      setPreviewImage(spot.previewImage);
    }
  }, [dispatch, spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!country) {
      errors.country = "Country is required";
    }
    if (!address) {
      errors.address = "Address is required";
    }
    if (!city) {
      errors.city = "City is required";
    }
    if (!state) {
      errors.state = "State is required";
    }
    if (description.length < 30) {
      errors.description = true;
    }
    if (!name) {
      errors.name = "Name is required";
    }
    if (!price) {
      errors.price = "Price is required";
    }
    if (!previewImage) {
      errors.previewImage = "Preview Image is required";
    }
    if (!country) {
      errors.country = "Country is required";
    }
    if (
      image2 &&
      (!image2.endsWith(".jpg") ||
        !image2.endsWith(".jpeg") ||
        !image2.endsWith(".png"))
    ) {
      errors.image2 = true;
    }
    if (
      image3 &&
      (!image3.endsWith(".jpg") ||
        !image3.endsWith(".jpeg") ||
        !image3.endsWith(".png"))
    ) {
      errors.image3 = true;
    }
    if (
      image4 &&
      (!image4.endsWith(".jpg") ||
        !image4.endsWith(".jpeg") ||
        !image4.endsWith(".png"))
    ) {
      errors.image4 = true;
    }
    if (
      image5 &&
      (!image5.endsWith(".jpg") ||
        !image5.endsWith(".jpeg") ||
        !image5.endsWith(".png"))
    ) {
      errors.image5 = true;
    }

    setErrors(errors);

    if (!Object.values(errors).length) {
      const spot = {
        address,
        city,
        state,
        country,
        lat: lat ? lat : 0,
        lng: lng ? lng : 0,
        name,
        description,
        price,
      };

      const { id } = spot
        ? await dispatch(updateCurrentSpot(spot, spotId))
        : await dispatch(createNewSpot(spot));

      const previewImg = {
        url: previewImage,
        preview: 1,
      };
      if (!spot) await dispatch(postSpotImage(previewImg, id));
      if (image2) {
        const image = {
          url: image2,
          preview: 0,
        };
        if (!spot) await dispatch(postSpotImage(image, id));
      }
      if (image3) {
        const image = {
          url: image3,
          preview: 0,
        };
        if (!spot) await dispatch(postSpotImage(image, id));
      }
      if (image4) {
        const image = {
          url: image4,
          preview: 0,
        };
        if (!spot) await dispatch(postSpotImage(image, id));
      }
      if (image5) {
        const image = {
          url: image5,
          preview: 0,
        };
        if (!spot) await dispatch(postSpotImage(image, id));
      }

      navigate(`/spots/${id}`);
    }
  };

  return (
    <div className="spotFormPage">
      <form className="spotForm" onSubmit={handleSubmit}>
        <div className="formSection1"></div>
        <div className="country">
          <label>
            Country
            {errors.country ? (
              <span className="errorMessage"> Country is required</span>
            ) : null}
          </label>
          <input
            id="country"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="address">
          <label>
            Street Address
            {errors.address ? (
              <span className="errorMessage">Address is required</span>
            ) : null}
          </label>
          <input
            id="address"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="cityState">
          <div className="city">
            <label>
              City
              {errors.city ? (
                <span className="errorMessage">City is required</span>
              ) : null}
            </label>
            <input
              id="city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <span>,</span>
          <div className="state">
            <label>
              State
              {errors.state ? (
                <span className="errorMessage">State is required</span>
              ) : null}
            </label>
            <input
              id="state"
              type="text"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div className="latLng">
          <div className="lat">
            <label>
              Latitude <span className="errorMessage">(Optional)</span>
            </label>
            <input
              id="lat"
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
            />
          </div>
          <span>,</span>
          <div className="lng">
            <label>
              Longitude <span className="errorMessage">(Optional)</span>
            </label>
            <input
              id="lng"
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="formSection2">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special ameneties like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            className="spotDescription"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write atleast 30 characters"
          />
          {errors.description && (
            <p className="errorMessage">
              Description needs a minimum of 30 characters
            </p>
          )}
        </div>
        <div className="formSection3">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests&apos; attention with a spot title that highlights what makes
            your place special
          </p>
          <input
            id="name"
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="errorMessage">Name is required</p>}
        </div>
        <div className="formSection4">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          <div className="price">
            <span>$</span>
            <input
              id="price"
              className="priceInput"
              placeholder="Price per night (USD)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          {errors.price && <p className="errorMessage">Price is required</p>}
        </div>
        <div className="formSection5">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to atleast one photo to publish your spot</p>
          <div className="spotImageUrl">
            <input
              id="previewImage"
              placeholder="Preview Image URL"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
            {errors.previewImage && (
              <p className="errorMessage">PreviewImage is required</p>
            )}
            <input
              id="image2"
              placeholder="Image URL"
              value={image2}
              onChange={(e) => setImage2(e.target.value)}
            />
            {errors.image2 && (
              <p className="errorMessage">
                Image URL must end in .png, .jpg, or.jpeg
              </p>
            )}
            <input
              id="image3"
              placeholder="Image URL"
              value={image3}
              onChange={(e) => setImage3(e.target.value)}
            />
            {errors.image3 && (
              <p className="errorMessage">
                Image URL must end in .png, .jpg, or.jpeg
              </p>
            )}
            <input
              id="image4"
              placeholder="Image URL"
              value={image4}
              onChange={(e) => setImage4(e.target.value)}
            />
            {errors.image4 && (
              <p className="errorMessage">
                Image URL must end in .png, .jpg, or.jpeg
              </p>
            )}
            <input
              id="image5"
              placeholder="Image URL"
              value={image5}
              onChange={(e) => setImage5(e.target.value)}
            />
            {errors.image5 && (
              <p className="errorMessage">
                Image URL must end in .png, .jpg, or.jpeg
              </p>
            )}
          </div>
        </div>
        <button className="createSpotButton" type="submit">
          {spot?"Update Spot":"Create Spot"}
        </button>
      </form>
    </div>
  );
}
