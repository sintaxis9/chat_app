import io from "socket.io-client";
import { useState, useEffect } from "react";
const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = prompt("enter ur username:");
    setUsername(name || "anon");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      body: message,
      from: username || "anon",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("message", newMessage);
    setMessage("");
  };

  useEffect(() => {
    const handleMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  return (
    <div>
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
