import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";

export default function Chat() {
  const { roomId } = useParams();

  const storedUser = localStorage.getItem("username");
  const [username, setUsername] = useState(storedUser || "");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ username: string; message: string }[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (storedUser) {
      socket.emit("join_room", { roomId, username: storedUser });
    }

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("user_joined", (user) => {
      setChat((prev) => [
        ...prev,
        { username: "SYSTEM", message: `${user} joined the chat` }
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
    };
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [chat]);

  const submitUsername = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && username.trim()) {
      localStorage.setItem("username", username);
      socket.emit("join_room", { roomId, username });
      window.location.reload();
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send_message", { roomId, message });
    setMessage("");
  };

  const handleEnterMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!storedUser) {
    return (
      <div style={styles.container}>
        <p style={styles.info}>Enter your codename:</p>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={submitUsername}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <p style={styles.info}>Room: {roomId}</p>

      <div ref={messagesRef} style={styles.chatBox}>
        {chat.map((msg, i) => (
          <p key={i} style={styles.message}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        style={styles.input}
        placeholder="Type and hit Enter..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleEnterMessage}
        autoFocus
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "black",
    color: "lime",
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  info: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  chatBox: {
    flex: 1,
    border: "1px solid lime",
    padding: "10px",
    overflowY: "auto",
    marginTop: "10px",
    marginBottom: "10px",
  },
  message: {
    margin: "4px 0",
    fontSize: "14px",
  },
  input: {
    backgroundColor: "black",
    color: "lime",
    border: "2px solid lime",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 0 10px lime",
  },
};
