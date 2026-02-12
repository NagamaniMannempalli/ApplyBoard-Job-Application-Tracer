import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post("https://applyboard-job-application-tracer.onrender.com/user/register", {
        ...formData,
        password: formData.password.trim(),
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        alert("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="app-container">
      <form style={styles.form} onSubmit={handleSubmit} className="form-card">
        <h2 style={styles.heading}>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.username && <p style={styles.error}>{errors.username}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <div style={styles.passwordWrapper}>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    style={styles.passwordInput}
  />

  <span
    style={styles.eye}
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "👁‍🗨" : "👁"}
  </span>
</div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  form: {
    background: "var(--bg-secondary)",
    padding: "32px",
    width: "360px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },

  /* 👁️ password styles */
  passwordWrapper: {
  position: "relative",
  width: "100%",
  marginBottom: "6px",
},

passwordInput: {
  width: "100%",
  padding: "10px 38px 10px 10px", // 👈 space for eye
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box", // 🔥 VERY IMPORTANT
},

eye: {
  position: "absolute",
  top: "50%",
  right: "12px",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "16px",
  color: "#555",
  userSelect: "none",
},

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "10px",
  },
};

export default Register;