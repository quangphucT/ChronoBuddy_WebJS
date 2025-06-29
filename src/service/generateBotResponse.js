export const generateBotResponse = async (history) => {
  // Đúng định dạng Gemini v1beta
  const formattedHistory = history.map(({ sender, text }) => ({
    role: sender === "user" ? "user" : "model",
    parts: [{ text }], // ✅ sửa tại đây
  }));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedHistory }),
  };

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, something went wrong.";
  }
};
