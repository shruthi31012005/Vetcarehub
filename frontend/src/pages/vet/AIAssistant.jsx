import { useState } from "react";
import api from "../../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIAssistant = () => {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (customMessage = null) => {

    const userMessage = customMessage || message;

    if (!userMessage.trim()) return;

    setLoading(true);
    setError("");

    // Add user message
    setChat((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    try {

      const res = await api.post("/chat/ai/", {
        message: userMessage
      });

      setChat((prev) => [
        ...prev,
        { sender: "ai", text: res.data.response }
      ]);

      setMessage("");

    } catch (err) {

      console.log("AI Error:", err.response?.data);

      setChat((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ AI service unavailable." }
      ]);

      setError("Failed to get AI response");
    }

    setLoading(false);
  };

  return (

    <div className="bg-gray-50 min-h-screen p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🧠 AI Health Assistant
        </h1>

        <p className="text-gray-500">
          Get instant answers to your animal health questions
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">

        {/* Welcome */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-sm">
            Hello! I'm your AI Animal Health Assistant. I can help you with
            animal diseases, vaccinations, feeding advice and preventive care.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="space-y-3 max-h-80 overflow-y-auto mb-6">

          {chat.map((msg, index) => (

            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] text-sm ${
                msg.sender === "user"
                  ? "bg-green-500 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>

          ))}

          {loading && (
            <div className="text-gray-400 text-sm">
              AI is typing...
            </div>
          )}

        </div>

        {/* Suggestion Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <button
            onClick={() => sendMessage("Common symptoms of fever in dogs")}
            className="border p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            Common symptoms of fever in dogs
          </button>

          <button
            onClick={() => sendMessage("Vaccination schedule for puppies")}
            className="border p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            Vaccination schedule for puppies
          </button>

          <button
            onClick={() => sendMessage("How to keep my cat healthy")}
            className="border p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            How to keep my cat healthy
          </button>

          <button
            onClick={() => sendMessage("Best diet for dairy cows")}
            className="border p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            Best diet for dairy cows
          </button>

        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask me anything about animal health..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-lg px-4 py-2 outline-none"
          />

          <button
            onClick={() => sendMessage()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>

        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          AI responses are informational. Always consult a veterinarian for serious concerns.
        </p>

      </div>

    </div>

  );
};

export default AIAssistant;