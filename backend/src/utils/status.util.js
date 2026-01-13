export const getCurrentStatus = (slots) => {
  if (!slots || slots.length === 0) return "Not Available";

  const currentTime = new Date().toTimeString().slice(0, 5);

  return slots.some(
    (slot) => currentTime >= slot.start && currentTime <= slot.end
  )
    ? "Available"
    : "Busy";
};
