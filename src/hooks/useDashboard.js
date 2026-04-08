/**
 * useDashboard Hook
 * Aggregates data for dashboard display
 */

import { useMemo } from "react";
import { useBookings } from "./useBookings";
import { useServices } from "./useServices";
import { useUsers } from "./useUsers";

export const useDashboardStats = () => {
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings();
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const { data: usersData, isLoading: usersLoading } = useUsers();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  const stats = useMemo(() => {
    const totalBookings = bookings?.length || 0;
    const pendingBookings =
      bookings?.filter((b) => b?.status === "PENDING")?.length || 0;
    const totalRevenue =
      bookings?.reduce((sum, b) => {
        const amount = parseFloat(b?.totalAmount) || 0;
        return sum + amount;
      }, 0) || 0;
    const activeCustomers = users?.length || 0;

    return [
      {
        id: 1,
        title: "Total Bookings",
        value: String(totalBookings),
        percentage: "8.5%",
        trend: "up",
        icon: "bookings",
        variant: "green",
      },
      {
        id: 2,
        title: "Pending",
        value: String(pendingBookings),
        percentage: "8.5%",
        trend: pendingBookings > 10 ? "up" : "down",
        icon: "pending",
        variant: "yellow",
      },
      {
        id: 3,
        title: "Revenue",
        value: String(Math.round(totalRevenue)),
        percentage: "8.5%",
        trend: totalRevenue > 1000 ? "up" : "down",
        icon: "revenue",
        variant: "red",
      },
      {
        id: 4,
        title: "Active Customers",
        value: String(activeCustomers),
        percentage: "8.5%",
        trend: "up",
        icon: "customers",
        variant: "blue",
      },
    ];
  }, [bookings, users]);

  const recentBookings = useMemo(() => {
    if (!bookings?.length) {
      return [];
    }
    return bookings.slice(0, 5).map((booking) => ({
      id: String(booking?.id || ""),
      customerId: booking?.bookingNumber || "-",
      name:
        `${booking?.contactFirstName || ""} ${booking?.contactLastName || ""}`.trim() ||
        "-",
      email: booking?.contactEmail || "-",
      dateTime: booking?.bookingDate
        ? new Date(booking.bookingDate).toLocaleString()
        : "-",
      status:
        booking?.status === "CONFIRMED" || booking?.status === "COMPLETED"
          ? "active"
          : "inactive",
    }));
  }, [bookings]);

  const serviceDistribution = useMemo(() => {
    if (!services?.length) {
      return [];
    }
    const colors = ["red", "green", "blue", "yellow", "purple"];
    return services.slice(0, 5).map((service, index) => {
      const serviceBookings =
        bookings?.filter((b) => b?.serviceId === service?.id)?.length || 0;
      const totalBookingsCount = bookings?.length || 1;
      const percentage = Math.round(
        (serviceBookings / totalBookingsCount) * 100,
      );
      return {
        id: service?.id,
        name: service?.name || "Service",
        bookings: serviceBookings,
        percentage: Math.max(percentage, 10),
        color: colors[index % colors.length],
      };
    });
  }, [services, bookings]);

  return {
    stats,
    recentBookings,
    serviceDistribution,
    isLoading: bookingsLoading || servicesLoading || usersLoading,
  };
};
