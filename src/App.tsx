import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && username.trim()) {
    const roomId = uuid();

    // Store creator name locally (temporary auth)
    localStorage.setItem("username", username);

    navigate(`/chat/${roomId}`);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Terminal Chat</h2>

      <p style={styles.text}>Enter your codename to start:</p>

      <input
        autoFocus
        style={styles.input}
        placeholder="Type username and hit Enter..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleEnter}
      />

      <div style={styles.footer}>
        Press <span style={styles.bold}>Enter</span> to deploy room 🚀
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "black",
    color: "lime",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    textShadow: "0 0 8px lime",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  input: {
    backgroundColor: "black",
    color: "lime",
    border: "2px solid lime",
    fontSize: "18px",
    padding: "10px",
    width: "300px",
    textAlign: "center",
    outline: "none",
    boxShadow: "0 0 10px lime",
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#00ff88",
  },
  bold: {
    fontWeight: "bold",
  },
};
