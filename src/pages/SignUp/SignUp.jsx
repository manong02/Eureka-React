import React, { useState } from "react";
import './SignUp.css';

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // POST data to the PHP backend (signup.php)
    fetch("http://localhost/backend/signup.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        console.log("Response from backend:", data);

        if (data.status === "success") {
          alert("Account created successfully");
          // Redirect to another page after successful signup
          window.location.href = "http://localhost:5173/"; // or any appropriate route
        } else {
          alert("Error: " + data.message); // Display error message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    // Simple password validation
    const isValid =
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
    setPasswordValid(isValid);
  };


  return (
    <div className="container">
      <div className="logo">
        <img src="/src/assets/mainlogo/logo.png" alt="eureka logo" />
      </div>
      <form className="login_container" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <ul className="password_requirements" id="password_requirements">
          <li className={password.length >= 10 ? "valid" : "invalid"}>
            At least 10 characters
          </li>
          <li className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
            At least one uppercase letter
          </li>
          <li className={/\d/.test(password) ? "valid" : "invalid"}>
            At least one number
          </li>
          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "valid" : "invalid"}>
            At least one special character (!, @, #, etc.)
          </li>
        </ul>
        <p>
          Already have an account?{" "}
          <span>
            <a href="/src/pages/LoginIn/LoginIn.jsx">Log in!</a>
          </span>
        </p>
        <button type="submit" disabled={!passwordValid}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUp;
