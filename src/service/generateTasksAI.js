export const generateTasksAI = async (projectData) => {
  // Tạo prompt cho AI để generate tasks
  const prompt = `
Bạn là một AI chuyên gia quản lý dự án. Hãy phân tích thông tin dự án sau và tạo ra danh sách các nhiệm vụ (tasks) chi tiết và thực tế:

**Thông tin dự án:**
- Tên dự án: ${projectData.name}
- Mô tả: ${projectData.description}
- Trạng thái: ${projectData.status}

**Yêu cầu:**
1. Tạo 5-8 nhiệm vụ (tasks) cụ thể và có thể thực hiện được
2. Mỗi nhiệm vụ phải có: tiêu đề, mô tả chi tiết, mức độ ưu tiên (LOW/MEDIUM/HIGH), ước tính thời gian hoàn thành
3. Các nhiệm vụ phải được sắp xếp theo thứ tự logic thực hiện
4. Phải bao gồm các giai đoạn: lập kế hoạch, phát triển, kiểm thử, triển khai

**Định dạng trả về (JSON):**
\`\`\`json
{
  "tasks": [
    {
      "title": "Tiêu đề nhiệm vụ",
      "description": "Mô tả chi tiết nhiệm vụ cần thực hiện",
      "priority": "HIGH|MEDIUM|LOW",
      "estimatedDays": 3,
      "category": "planning|development|testing|deployment"
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
      
      // Fallback: tạo tasks mẫu nếu AI response không parse được
      return [
        {
          title: "Phân tích yêu cầu dự án",
          description: "Thu thập và phân tích chi tiết các yêu cầu của dự án " + projectData.name,
          priority: "HIGH",
          estimatedDays: 2,
          category: "planning"
        },
        {
          title: "Thiết kế kiến trúc hệ thống",
          description: "Thiết kế kiến trúc tổng thể và các component chính",
          priority: "HIGH",
          estimatedDays: 3,
          category: "planning"
        },
        {
          title: "Phát triển backend API",
          description: "Xây dựng các API backend cần thiết cho dự án",
          priority: "MEDIUM",
          estimatedDays: 5,
          category: "development"
        },
        {
          title: "Phát triển giao diện người dùng",
          description: "Thiết kế và phát triển UI/UX cho ứng dụng",
          priority: "MEDIUM",
          estimatedDays: 4,
          category: "development"
        },
        {
          title: "Kiểm thử tính năng",
          description: "Thực hiện kiểm thử unit test và integration test",
          priority: "HIGH",
          estimatedDays: 2,
          category: "testing"
        },
        {
          title: "Triển khai sản phẩm",
          description: "Deploy ứng dụng lên môi trường production",
          priority: "MEDIUM",
          estimatedDays: 1,
          category: "deployment"
        }
      ];
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Không thể kết nối với AI để tạo tasks. Vui lòng thử lại.");
  }
};
