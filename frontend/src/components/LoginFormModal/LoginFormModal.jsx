import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      });
  };

  const demoUser = () => {
    setCredential("Demo-lition");
    setPassword("password");
    handleSubmit();
  };

  return (
    <>
      <h1 className="loginH1">Log In</h1>
      {errors.credential && (
        <p className="credentialError">{errors.credential}</p>
      )}
      <form className="login" onSubmit={handleSubmit}>
        <input
          className="credential"
          placeholder="Email or Username"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          className="credential"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="loginButton"
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <button className="demoUser" type="submit" onClick={demoUser}>
          Demo User Login
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
