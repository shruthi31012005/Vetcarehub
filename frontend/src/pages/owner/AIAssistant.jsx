import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (customMessage = null) => {
    const userMessage = customMessage || message;

    if (!userMessage.trim()) return;

    setLoading(true);
    setError("");
    setShowSuggestions(false); // ✅ hide suggestions after first message

    setChat((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    try {
      const res = await api.post("/chat/ai/", {
        message: userMessage,
      });

      setChat((prev) => [
        ...prev,
        { sender: "ai", text: res.data.response },
      ]);

      setMessage("");
    } catch (err) {
      console.log("AI Error:", err.response?.data);
      setError("Failed to get AI response");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🧠 AI Health Assistant
        </h1>
        <p className="text-gray-500">
          Get instant answers to your animal health questions
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-xl shadow flex flex-col flex-1 overflow-hidden">
        
        {/* Welcome */}
        {chat.length === 0 && (
          <div className="bg-gray-100 p-4 m-4 rounded-lg">
            <p className="text-sm">
              Hello! I'm your AI Animal Health Assistant. I can help you with
              diseases, vaccinations, feeding advice, and preventive care.
            </p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-green-100 ml-auto text-right"
                  : "bg-gray-100"
              }`}
            >
              {msg.sender === "ai" ? (
                <div className="prose max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-100 p-3 rounded-lg text-sm w-fit">
              AI is thinking...
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm px-4 py-2">{error}</p>
        )}

        {/* Suggestions */}
        {showSuggestions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border-t">
            <button
              onClick={() =>
                sendMessage("Common symptoms of fever in dogs")
              }
              className="border p-3 rounded-lg hover:bg-gray-50 text-left"
            >
              Common symptoms of fever in dogs
            </button>

            <button
              onClick={() =>
                sendMessage("Vaccination schedule for puppies")
              }
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
        )}

        {/* Input */}
        <div className="flex gap-3 p-4 border-t">
          <input
            type="text"
            placeholder="Ask me anything about animal health..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-lg px-4 py-2 outline-none"
          />

          <button
            disabled={loading}
            onClick={() => sendMessage()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
          >
            Send
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center pb-2">
          AI responses are informational. Always consult a veterinarian for serious concerns.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
// import { useState, useRef, useEffect } from "react";
// import api from "../../services/api";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// const AIAssistant = () => {

//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const sendMessage = async (customMessage = null) => {

//     const userMessage = customMessage || message;

//     if (!userMessage.trim()) return;

//     setLoading(true);
//     setError("");

//     setChat((prev) => [
//       ...prev,
//       { sender: "user", text: userMessage }
//     ]);

//     try {

//       const res = await api.post("/chat/ai/", {
//         message: userMessage
//       });

//       setChat((prev) => [
//         ...prev,
//         { sender: "ai", text: res.data.response }
//       ]);

//       setMessage("");

//     } catch (err) {

//       console.log("AI Error:", err.response?.data);
//       setError("Failed to get AI response");

//     }

//     setLoading(false);

//   };

//   return (

//     <div className="bg-gray-50 min-h-screen p-8">

//       {/* Header */}

//       <div className="mb-8">

//         <h1 className="text-2xl font-bold flex items-center gap-2">
//           🧠 AI Health Assistant
//         </h1>

//         <p className="text-gray-500">
//           Get instant answers to your animal health questions
//         </p>

//       </div>

//       {/* Chat Container */}

//       <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">

//         {/* Welcome */}

//         <div className="bg-gray-100 p-4 rounded-lg mb-6">

//           <p className="text-sm">
//             Hello! I'm your AI Animal Health Assistant. I can help you with
//             diseases, vaccinations, feeding advice, and preventive care.
//           </p>

//         </div>

//         {/* Chat Messages */}

//         <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">

//           {chat.map((msg, index) => (

//             <div
//               key={index}
//               className={`p-4 rounded-lg max-w-[80%] ${
//                 msg.sender === "user"
//                   ? "bg-green-100 ml-auto text-right"
//                   : "bg-gray-100"
//               }`}
//             >

//               {msg.sender === "ai" ? (

//                 <div className="prose max-w-none text-sm">
//                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                     {msg.text}
//                   </ReactMarkdown>
//                 </div>

//               ) : (

//                 <p className="text-sm">{msg.text}</p>

//               )}

//             </div>

//           ))}

//           {loading && (
//             <div className="bg-gray-100 p-3 rounded-lg text-sm">
//               AI is thinking...
//             </div>
//           )}

//           <div ref={chatEndRef}></div>

//         </div>

//         {/* Error */}

//         {error && (
//           <p className="text-red-500 text-sm mb-4">
//             {error}
//           </p>
//         )}

//         {/* Suggestions */}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

//           <button
//             onClick={() => sendMessage("Common symptoms of fever in dogs")}
//             className="border p-3 rounded-lg hover:bg-gray-50 text-left"
//           >
//             Common symptoms of fever in dogs
//           </button>

//           <button
//             onClick={() => sendMessage("Vaccination schedule for puppies")}
//             className="border p-3 rounded-lg hover:bg-gray-50 text-left"
//           >
//             Vaccination schedule for puppies
//           </button>

//           <button
//             onClick={() => sendMessage("How to keep my cat healthy")}
//             className="border p-3 rounded-lg hover:bg-gray-50 text-left"
//           >
//             How to keep my cat healthy
//           </button>
//           <button
//             onClick={() => sendMessage("Best diet for dairy cows")}
//             className="border p-3 rounded-lg hover:bg-gray-50 text-left"
//           >
//             Best diet for dairy cows
//           </button>

//         </div>

//         {/* Input */}

//         <div className="flex gap-3">

//           <input
//             type="text"
//             placeholder="Ask me anything about animal health..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             className="flex-1 border rounded-lg px-4 py-2 outline-none"
//           />

//           <button
//             disabled={loading}
//             onClick={() => sendMessage()}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
//           >
//             Send
//           </button>

//         </div>

//         <p className="text-xs text-gray-400 mt-4 text-center">
//           AI responses are informational. Always consult a veterinarian for serious concerns.
//         </p>

//       </div>

//     </div>

//   );

// };

// export default AIAssistant;