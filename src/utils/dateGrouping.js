/**
 * Date Grouping Utility
 * Groups flat booking arrays by date for calendar view rendering
 */

import dayjs from "dayjs";

/**
 * Groups an array of bookings by their booking date.
 * Returns a sorted array of { date, dayLabel, dateLabel, bookings } objects.
 *
 * @param {Array} bookings - Flat array of booking objects
 * @param {string} dateField - Field name to group by (default: "bookingDate")
 * @returns {Array<{ date: string, dayLabel: string, dateLabel: string, bookings: Array }>}
 */
export const groupBookingsByDate = (bookings = [], dateField = "bookingDate") => {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return [];
  }

  const grouped = {};
  let minDate = null;
  let maxDate = null;

  bookings.forEach((booking) => {
    const rawDate = booking?.[dateField];
    if (!rawDate) return;

    const dateKey = dayjs(rawDate).format("YYYY-MM-DD");
    const dateVal = dayjs(rawDate).valueOf();

    if (!minDate || dateVal < minDate) minDate = dateVal;
    if (!maxDate || dateVal > maxDate) maxDate = dateVal;

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(booking);
  });

  if (!minDate || !maxDate) return [];

  const results = [];
  let current = dayjs(minDate);
  const end = dayjs(maxDate);

  while (current.isBefore(end) || current.isSame(end, "day")) {
    const dateKey = current.format("YYYY-MM-DD");
    const bookingsForDay = grouped[dateKey] || [];

    // Sort bookings within the day by startTime ascending
    const dayBookings = [...bookingsForDay].sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.localeCompare(b.startTime);
    });

    results.push({
      date: dateKey,
      dayLabel: current.format("ddd"),
      dateLabel: current.format("DD"),
      monthLabel: current.format("MMM"),
      fullDate: current.format("DD MMM YYYY"),
      bookings: dayBookings,
    });

    current = current.add(1, "day");
  }

  return results;
};
