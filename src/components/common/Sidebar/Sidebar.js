/**
 * Sidebar Component
 * Navigation sidebar for the dashboard
 * Pixel-perfect implementation matching the KLYRA design
 */

import { useServicesAdmin } from "@/hooks/useServices";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import {
  FiBarChart2,
  FiBox,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiGrid,
  FiMenu,
  FiPercent,
  FiRepeat,
  FiSettings,
  FiTag,
  FiUsers
} from "react-icons/fi";
import styles from "../../../../styles/sidebar.module.css";

const SidebarItem = memo(({ item, isActive, collapsed, onClick }) => {
  const IconComponent = item.icon;

  return (
    <Link href={item.key} className={styles.menuItemLink} onClick={onClick}>
      <div
        className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""} ${collapsed ? styles.menuItemCollapsed : ""}`}
      >
        <IconComponent className={styles.menuIcon} />
        <span
          className={`${styles.menuLabel} ${collapsed ? styles.menuLabelCollapsed : ""}`}
        >
          {item.label}
        </span>
        {item.badge !== null && (
          <span
            className={`${styles.badge} ${collapsed ? styles.badgeCollapsed : ""}`}
          >
            {item.badge}
          </span>
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
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
};

SidebarItem.defaultProps = {
  isActive: false,
  collapsed: false,
  onClick: null,
};

const Sidebar = ({ collapsed, onCollapse, isMobile }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation();
  const { data: servicesData } = useServicesAdmin();

  const MENU_ITEMS = useMemo(
    () => [
      {
        key: "/",
        icon: FiGrid,
        label: t("navigation.dashboard"),
        badge: null,
      },
      {
        key: "/customers",
        icon: FiUsers,
        label: t("navigation.customers"),
        badge: null,
      },
      {
        key: "/booking",
        icon: FiCalendar,
        label: t("navigation.bookings"),
        badge: null,
      },
      {
        key: "/subscriptions",
        icon: FiRepeat,
        label: t("navigation.subscriptions"),
        badge: null,
      },
      {
        key: "/services-pricing",
        icon: FiTag,
        label: t("navigation.services"),
        badge: servicesData?.totalCount || 0,
      },
      {
        key: "/pricing-rules",
        icon: FiDollarSign,
        label: t("navigation.pricingRules"),
        badge: null,
      },
      {
        key: "/additional-services",
        icon: FiBox,
        label: t("navigation.additionalServices"),
        badge: null,
      },
      {
        key: "/analytics",
        icon: FiBarChart2,
        label: t("navigation.analytics"),
        badge: null,
      },
      {
        key: "/discount-code",
        icon: FiPercent,
        label: t("navigation.discountCodes"),
        badge: null,
      },
      {
        key: "/special-offers",
        icon: FiGift,
        label: t("navigation.specialOffers"),
        badge: null,
      },
      {
        key: "/payments",
        icon: FiCreditCard,
        label: t("navigation.payments"),
        badge: null,
      },
      {
        key: "/setttings",
        icon: FiSettings,
        label: t("navigation.settings"),
        badge: null,
      },
    ],
    [servicesData, t],
  );

  const handleMenuToggle = () => {
    if (isMobile) {
      if (onCollapse) onCollapse(true);
    } else {
      if (onCollapse) onCollapse(!collapsed);
    }
  };

  const handleItemClick = () => {
    if (isMobile && onCollapse) {
      onCollapse(true);
    }
  };

  const menuElements = useMemo(() => {
    return MENU_ITEMS.map((item) => (
      <SidebarItem
        key={item.key}
        item={item}
        isActive={
          item.key === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.key)
        }
        collapsed={collapsed}
        onClick={handleItemClick}
      />
    ));
  }, [MENU_ITEMS, currentPath, collapsed, handleItemClick]);

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}
    >
      <div
        className={`${styles.header} ${collapsed ? styles.headerCollapsed : ""}`}
      >
        <div
          className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ""}`}
        >
          <img src="/images/klayra_logo.svg" alt="KLYRA" className={styles.logoImage} />
        </div>
        <button
          type="button"
          className={`${styles.menuToggle} ${isMobile ? styles.menuToggleMobile : ""}`}
          onClick={handleMenuToggle}
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
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  isMobile: PropTypes.bool,
};

Sidebar.defaultProps = {
  collapsed: false,
  onCollapse: null,
  isMobile: false,
};

export default memo(Sidebar);
