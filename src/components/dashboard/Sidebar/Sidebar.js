/**
 * Sidebar Component
 * Navigation sidebar for the dashboard
 * Pixel-perfect implementation matching the KLYRA design
 */

import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import {
  FiBarChart2,
  FiBox,
  FiCalendar,
  FiGrid,
  FiMenu,
  FiPercent,
  FiSettings,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import styles from "../../../../styles/sidebar.module.css";

const MENU_ITEMS = [
  {
    key: "/",
    icon: FiGrid,
    label: "Dashboard",
    badge: null,
  },
  {
    key: "/customers",
    icon: FiUsers,
    label: "Customers",
    badge: null,
  },
  {
    key: "/booking",
    icon: FiCalendar,
    label: "Booking",
    badge: null,
  },
  {
    key: "/services-pricing",
    icon: FiTag,
    label: "Services & Pricing",
    badge: 3,
  },
  {
    key: "/additional-services",
    icon: FiBox,
    label: "Additional Services",
    badge: null,
  },
  {
    key: "/analytics",
    icon: FiBarChart2,
    label: "Analytics",
    badge: null,
  },
  {
    key: "/discount-code",
    icon: FiPercent,
    label: "Discount Code",
    badge: null,
  },
  {
    key: "/settings",
    icon: FiSettings,
    label: "Settings",
    badge: null,
  },
];

const SidebarItem = memo(({ item, isActive }) => {
  const IconComponent = item.icon;

  return (
    <Link href={item.key} className={styles.menuItemLink}>
      <div
        className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
      >
        <IconComponent className={styles.menuIcon} />
        <span className={styles.menuLabel}>{item.label}</span>
        {item.badge !== null && (
          <span className={styles.badge}>{item.badge}</span>
        )}
      </div>
    </Link>
  );
});

SidebarItem.displayName = "SidebarItem";

SidebarItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.number,
  }).isRequired,
  isActive: PropTypes.bool,
};

SidebarItem.defaultProps = {
  isActive: false,
};

const Sidebar = ({ onMenuToggle }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuElements = useMemo(() => {
    return MENU_ITEMS.map((item) => (
      <SidebarItem
        key={item.key}
        item={item}
        isActive={currentPath === item.key}
      />
    ));
  }, [currentPath]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>KLYRA</span>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <FiMenu className={styles.menuToggleIcon} />
        </button>
      </div>

      <nav className={styles.nav}>{menuElements}</nav>
    </aside>
  );
};

Sidebar.propTypes = {
  onMenuToggle: PropTypes.func,
};

Sidebar.defaultProps = {
  onMenuToggle: () => {},
};

export default memo(Sidebar);
