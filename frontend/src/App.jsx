import io from "socket.io-client";
import { useState } from "react";

const socket = io("/");

function App() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("chat message", message);
    setMessage("");
  };

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
    </div>
  );
}
export default App;
