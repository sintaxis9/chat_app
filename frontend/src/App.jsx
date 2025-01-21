import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    const handleMessage = (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
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
          placeholder="write"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit"> send </button>
      </form>

      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
