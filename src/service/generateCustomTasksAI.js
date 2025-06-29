export const generateCustomTasksAI = async (projectData, customPrompt) => {
  // Tạo prompt tùy chỉnh cho AI
  const prompt = `
Bạn là một AI chuyên gia quản lý dự án. Hãy phân tích thông tin dự án và yêu cầu tùy chỉnh sau để tạo ra danh sách các nhiệm vụ (tasks) phù hợp:

**Thông tin dự án:**
- Tên dự án: ${projectData.name}
- Mô tả: ${projectData.description}
- Trạng thái: ${projectData.status}

**Yêu cầu tùy chỉnh của người dùng:**
${customPrompt}

**Hướng dẫn:**
1. Tạo các nhiệm vụ (tasks) dựa trên yêu cầu tùy chỉnh ở trên
2. Mỗi nhiệm vụ phải có: tiêu đề, mô tả chi tiết, mức độ ưu tiên (LOW/MEDIUM/HIGH), ước tính thời gian hoàn thành
3. Các nhiệm vụ phải thực tế và có thể thực hiện được
4. Số lượng task tùy thuộc vào yêu cầu (từ 3-10 tasks)

**Định dạng trả về (JSON):**
\`\`\`json
{
  "tasks": [
    {
      "title": "Tiêu đề nhiệm vụ",
      "description": "Mô tả chi tiết nhiệm vụ cần thực hiện",
      "priority": "HIGH|MEDIUM|LOW",
      "estimatedDays": 3,
      "category": "custom"
    }
  ]
}
\`\`\`

Hãy trả về CHỈ dữ liệu JSON, không có text thêm.
`;

  const history = [
    {
      sender: "user",
      text: prompt
    }
  ];

  // Định dạng cho Gemini API
  const formattedHistory = history.map(({ sender, text }) => ({
    role: sender === "user" ? "user" : "model",
    parts: [{ text }],
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

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse JSON từ response của AI
    try {
      // Loại bỏ markdown code blocks nếu có
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedTasks = JSON.parse(cleanedResponse);
      
      return parsedTasks.tasks || [];
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("AI Response:", aiResponse);
      
      // Fallback: tạo tasks mẫu dựa trên custom prompt
      return [
        {
          title: "Task tùy chỉnh 1",
          description: `Nhiệm vụ được tạo dựa trên yêu cầu: "${customPrompt.substring(0, 100)}..."`,
          priority: "MEDIUM",
          estimatedDays: 2,
          category: "custom"
        },
        {
          title: "Task tùy chỉnh 2", 
          description: `Nhiệm vụ bổ sung cho dự án ${projectData.name}`,
          priority: "LOW",
          estimatedDays: 1,
          category: "custom"
        }
      ];
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Không thể kết nối với AI để tạo tasks tùy chỉnh. Vui lòng thử lại.");
  }
};
