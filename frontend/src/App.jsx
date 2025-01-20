import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
      setMessages([...messages, message]);
    });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="write"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit"> send </button>
      </form>

      <ul>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
