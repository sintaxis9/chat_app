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
  const [showUsername, setShowUsername] = useState(false);

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
        console.error("Error loading messages:", err);
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

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/check?email=${email}`,
      );
      const data = await response.json();
      setShowUsername(!data.exists);
    } catch (err) {
      console.error("Error checking email:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if ((showUsername && !username) || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user.id);
        setUsername(data.user.name);
        localStorage.setItem("username", data.user.name);
        localStorage.setItem("userId", data.user.id);
        setIsLoggedIn(true);
        setEmail("");
        setPassword("");
        setUsername("");
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, data: message }),
    }).catch((err) => console.error("Error sending message:", err));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h2>{showUsername ? "Register" : "Login"}</h2>
        <form onSubmit={handleLogin} className="auth-form">
          {showUsername && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value === "") setShowUsername(false);
            }}
            onBlur={() => email && checkEmailExists(email)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">{showUsername ? "Register" : "Login"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Welcome, {username}!</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="chat-messages">
        <ul>
          {messages.map((msg, index) => (
            <li
              key={index}
              className={
                msg.from === username ? "own-message" : "other-message"
              }
            >
              <div className="message-content">
                {msg.from !== username && (
                  <span className="sender">{msg.from}</span>
                )}
                <p>{msg.body}</p>
                <span className="timestamp">
                  {new Date(msg.send_in).toLocaleTimeString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
