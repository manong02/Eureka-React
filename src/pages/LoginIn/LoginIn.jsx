import React, { useState } from "react";
import './LoginIn.css'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
  
    // POST data to the PHP backend (login.php)
    fetch("http://localhost:8000/backend/login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        console.log("Response from backend:", data);
  
        if (data.status === "success") {
          // Handle successful login (e.g., redirect or show message)
          alert("Logged in successfully");
          // Redirect to another page after successful login
          window.location.href = "http://localhost:5173/"; // or any appropriate route
        } else {
          // Handle error (e.g., show error message)
          alert("Error: " + data.message); // Display error message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="/src/assets/mainlogo/logo.png" alt="eureka logo" />
      </div>
      <form className="login_container" onSubmit={handleSubmit}>
        <h1>Login</h1>
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
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p>
          No account?{" "}
          <span>
            <a href="http://localhost:5173/signup">Create one!</a>
          </span>
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
