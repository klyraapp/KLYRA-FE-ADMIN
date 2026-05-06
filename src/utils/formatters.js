/**
 * Data Formatters
 * Utility functions for formatting data for display
 */

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "-";
  const parts = timeString.split(":");
  if (parts.length < 2) return "-";
  const [hours, minutes] = parts;
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount, currency = "NOK") => {
  if (amount === null || amount === undefined) return "-";
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "-";
  return `${numAmount.toFixed(2)} ${currency}`;
};

export const formatArea = (sqm) => {
  if (!sqm) return "-";
  return `${parseFloat(sqm).toFixed(0)} m²`;
};

export const formatBookingStatus = (status) => {
  if (status === null || status === undefined) return "reserved";
  const statusMap = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };
  return statusMap[status] || "pending";
};

export const formatPromoCodeStatus = (isActive) => {
  return isActive ? "active" : "inactive";
};

export const formatDiscountValue = (value, type) => {
  if (!value) return "-";
  return type === "PERCENTAGE" ? `${value}%` : `$${value}`;
};
