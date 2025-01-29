import io from "socket.io-client";
import { useState, useEffect } from "react";
const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedUserId = localStorage.getItem("userId");
    if (savedUsername && savedUserId) {
      setUsername(savedUsername);
      setUserId(savedUserId);
      setIsLoggedIn(true);
    }

    const loadMessages = async () => {
      try {
        const response = await fetch("http://localhost:3000/messages");
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error al cargar mensajes:", err);
      }
    };
    loadMessages();

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setUsername(data.user.name);
        setUserId(data.user.id);
        localStorage.setItem("username", data.user.name);
        localStorage.setItem("userId", data.user.id);
        setIsLoggedIn(true);
      } else {
        alert("invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("error logging in");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      body: message,
      from: username,
      id: Date.now(),
      user_id: userId,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("message", newMessage);
    setMessage("");

    fetch("http://localhost:3000/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        data: message,
      }),
    }).catch((err) => console.error("error al enviar mensaje:", err));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <ul>
        {messages.map((msg, index) => (
          <li
            key={index}
            style={{
              textAlign: msg.from === username ? "right" : "left",
              color: msg.from === username ? "blue" : "red",
            }}
          >
            <strong>{msg.from}:</strong> {msg.body}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
