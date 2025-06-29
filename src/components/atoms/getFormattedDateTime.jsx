// src/utils/timeUtils.ts

export const getFormattedDateTime = () => {
  const now = new Date();

  const day = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} | ${time}`;
};
