import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // navigate('/'); // Redirect to Quiz page or any other page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Thank You for Completing the Test!</h1>
      <p style={styles.text}>
        We hope you had a great experience. Your feedback is valuable to us.
        Please take a moment to share your thoughts below.
      </p>
      {!submitted ? (
        <form style={styles.form} onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Enter your feedback here..."
            required
          ></textarea>
          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>
      ) : (
        <p style={styles.thankYou}>Thank you for your feedback!</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  thankYou: {
    fontSize: "1.5rem",
    color: "#28a745",
  },
};

export default FeedbackPage;