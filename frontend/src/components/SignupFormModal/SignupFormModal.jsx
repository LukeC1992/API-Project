import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="signup"
        data-testid="sign-up-form"
      >
        <input
          className="credential"
          type="text"
          placeholder="Email"
          data-testid="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && (
          <p className="credentialError" data-testid="email-error-message">
            {errors.email}
          </p>
        )}
        <input
          className="credential"
          placeholder="Username"
          data-testid="username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && (
          <p className="credentialError" data-testid="username-error-message">
            {errors.username}
          </p>
        )}
        <input
          className="credential"
          type="text"
          placeholder="First Name"
          data-testid="first-name-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && (
          <p className="credentialError">{errors.firstName}</p>
        )}
        <input
          className="credential"
          type="text"
          placeholder="Last Name"
          data-testid="last-name-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && (
          <p className="credentialError">{errors.lastName}</p>
        )}
        <input
          className="credential"
          type="password"
          placeholder="Password"
          data-testid="password-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && (
          <p className="credentialError">{errors.password}</p>
        )}
        <input
          className="credential"
          type="password"
          placeholder="Confirm Password"
          data-testid="confirm-password-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="credentialError">{errors.confirmPassword}</p>
        )}
        <button
          className="signupButton"
          type="submit"
          data-testid="form-sign-up-button"
          disabled={
            !email ||
            !username ||
            !firstName ||
            !lastName ||
            !password ||
            !confirmPassword ||
            username.length < 4 ||
            password.length < 6 ||
            password !== confirmPassword
          }
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
