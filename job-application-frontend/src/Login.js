import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});       // field-specific errors
  const [generalError, setGeneralError] = useState(""); // top banner

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});
    setGeneralError("");

    try {
      const response = await loginUser({ email, password });

      // IMPORTANT: backend returns { token: "..." } → take .token
      const token = response.data.token;

      console.log("Login success - Token:", token.substring(0, 20) + "...");

      localStorage.setItem("token", token);

      // Optional: verify it's saved
      console.log("Saved token in localStorage:", localStorage.getItem("token")?.substring(0, 20) + "...");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);

      const data = err.response?.data;

      if (data?.field && data?.message) {
        // Show error under specific field
        setErrors({ [data.field]: data.message });
      } else if (data?.message) {
        // Fallback to general error
        setGeneralError(data.message);
      } else {
        setGeneralError("Login failed. Please check your connection or try again.");
      }
    }
  };

  return (
    <div style={styles.container} className="app-container">
      <form style={styles.form} onSubmit={handleSubmit} className="form-card">
        <h2 style={styles.heading}>Login</h2>

        {/* General error banner */}
        {generalError && (
          <div style={styles.generalError}>
            {generalError}
          </div>
        )}

        <div style={styles.field}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              ...styles.input,
              borderColor: errors.email ? "#dc3545" : "#ccc",
            }}
          />
          {errors.email && (
            <span style={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div style={styles.field}>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                ...styles.passwordInput,
                borderColor: errors.password ? "#dc3545" : "#ccc",
              }}
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.password && (
            <span style={styles.errorText}>{errors.password}</span>
          )}
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>

        <div style={styles.links}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
        </div>

        <p style={styles.text}>
          Not registered?{" "}
          <Link to="/register" style={styles.link}>
            Create an account
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
    padding: "40px",
    width: "360px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "28px",
    color: "#333",
  },
  field: {
    marginBottom: "20px",
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 44px 12px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  eye: {
    position: "absolute",
    top: "50%",
    right: "14px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
    color: "#555",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "13px",
    marginTop: "4px",
    display: "block",
  },
  generalError: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.2s",
  },
  links: {
    textAlign: "right",
    marginTop: "12px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px",
  },
  text: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
  },
};

export default Login;