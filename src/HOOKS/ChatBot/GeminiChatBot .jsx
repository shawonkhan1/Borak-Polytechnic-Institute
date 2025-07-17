import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_KEY = "AIzaSyClqinhEs_Ek4N8GIXbNCE18IRK_8k0dRA";




const GeminiChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // Chat UI visibility toggle
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (visible) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, visible]);

  const callModel = async (model) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
    return axios.post(url, {
      contents: [{ parts: [{ text: input }] }],
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      let response;
      try {
        response = await callModel("gemini-1.5-flash");
      } catch {
        response = await callModel("gemini-1.5-pro");
      }

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";

      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Server is busy, please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Messenger style chat bubble icon */}
      <button
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Close Chat" : "Open Chat"}
        title={visible ? "Close Chat" : "Open Chat"}
        className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center focus:outline-none select-none"
        style={{
          width: "56px",
          height: "56px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.21.9 4.21 2.35 5.65L4 22l4.39-1.39A9.967 9.967 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1.53 13.22l-2.81-3.15-4.1 3.13 5.01-5.3 2.81 3.15 4.1-3.13-5.01 5.3z" />
        </svg>
      </button>

      {/* Chat UI */}
      {visible && (
        <div className="fixed bottom-20 right-5 max-w-lg w-[350px] h-[60vh] bg-white rounded-md shadow-md border border-gray-300 flex flex-col z-50">
          <header className="px-6 py-4 border-b border-gray-200 font-semibold text-xl text-gray-800 select-none">
            Gemini ChatBot
          </header>

          <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && !loading && (
              <p className="text-center text-gray-400 italic select-none">
                Type your message and hit Send...
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg border ${
                    msg.role === "user"
                      ? "bg-white border-blue-500 text-blue-700 rounded-tr-none"
                      : "bg-gray-100 border-gray-300 text-gray-800 rounded-tl-none"
                  } whitespace-pre-line break-words shadow-sm`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-center text-gray-500 select-none">Loading...</p>
            )}

            <div ref={messagesEndRef} />
          </main>

          <footer className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2 rounded-b-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 rounded-md transition-colors duration-150 select-none"
              aria-label="Send message"
            >
              Send
            </button>
          </footer>
        </div>
      )}
    </>
  );
};

export default GeminiChatBot;
