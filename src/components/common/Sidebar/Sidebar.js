/**
 * Sidebar Component
 * Navigation sidebar with RBAC-based permission filtering
 * and collapsible "Access Control" section
 */

import { useServicesAdmin } from "@/hooks/useServices";
import { useTranslation } from "@/hooks/useTranslation";
import usePermission from "@/hooks/usePermission";
import { SIDEBAR_PERMISSIONS } from "@/utils/sidebarPermissions";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiGrid,
  FiMenu,
  FiPercent,
  FiRepeat,
  FiSettings,
  FiShield,
  FiTag,
  FiUserCheck,
  FiUsers,
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

/**
 * Collapsible sidebar section with sub-items.
 */
const SidebarGroup = memo(({
  label,
  icon: IconComponent,
  items,
  collapsed: sidebarCollapsed,
  currentPath,
  onClick,
}) => {
  const [expanded, setExpanded] = useState(true);

  const isGroupActive = items.some((item) =>
    item.key === "/"
      ? currentPath === "/"
      : currentPath.startsWith(item.key),
  );

  const handleToggle = useCallback(() => {
    if (!sidebarCollapsed) {
      setExpanded((prev) => !prev);
    }
  }, [sidebarCollapsed]);

  return (
    <div className={styles.menuGroup}>
      <button
        type="button"
        className={`${styles.menuGroupHeader} ${isGroupActive ? styles.menuGroupHeaderActive : ""}`}
        onClick={handleToggle}
      >
        <div className={styles.menuGroupLeft}>
          <IconComponent className={styles.menuIcon} />
          {!sidebarCollapsed && (
            <span className={styles.menuLabel}>{label}</span>
          )}
        </div>
        {!sidebarCollapsed && (
          expanded
            ? <FiChevronDown className={styles.menuGroupChevron} />
            : <FiChevronRight className={styles.menuGroupChevron} />
        )}
      </button>
      {expanded && !sidebarCollapsed && (
        <div className={styles.menuGroupItems}>
          {items.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              isActive={
                item.key === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.key)
              }
              collapsed={sidebarCollapsed}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
});

SidebarGroup.displayName = "SidebarGroup";

SidebarGroup.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  collapsed: PropTypes.bool,
  currentPath: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

SidebarGroup.defaultProps = {
  collapsed: false,
  onClick: null,
};

/**
 * Checks whether a sidebar item should be visible based on permissions.
 */
const isItemVisible = (item, can, canAny) => {
  const requiredPermission = SIDEBAR_PERMISSIONS[item.key];

  if (!requiredPermission) {
    return true;
  }

  if (Array.isArray(requiredPermission)) {
    return canAny(requiredPermission);
  }

  return can(requiredPermission);
};

const Sidebar = ({ collapsed, onCollapse, isMobile }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation();
  const { data: servicesData } = useServicesAdmin();
  const { can, canAny } = usePermission();

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
        key: "/settings",
        icon: FiSettings,
        label: t("navigation.settings"),
        badge: null,
      },
    ],
    [servicesData, t],
  );

  const ACCESS_CONTROL_ITEMS = useMemo(
    () => [
      {
        key: "/roles",
        icon: FiShield,
        label: t("navigation.roles") || "Roles",
        badge: null,
      },
      {
        key: "/user-roles",
        icon: FiUserCheck,
        label: t("navigation.userRoles") || "User Roles",
        badge: null,
      },
    ],
    [t],
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

  const filteredMenuItems = useMemo(
    () => MENU_ITEMS.filter((item) => isItemVisible(item, can, canAny)),
    [MENU_ITEMS, can, canAny],
  );

  const filteredAccessControlItems = useMemo(
    () => ACCESS_CONTROL_ITEMS.filter((item) => isItemVisible(item, can, canAny)),
    [ACCESS_CONTROL_ITEMS, can, canAny],
  );

  const menuElements = useMemo(() => {
    return filteredMenuItems.map((item) => (
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
  }, [filteredMenuItems, currentPath, collapsed, handleItemClick]);

  const showAccessControl = filteredAccessControlItems.length > 0;

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

      <nav className={styles.nav}>
        {menuElements}

        {showAccessControl && (
          <SidebarGroup
            label={t("navigation.accessControl") || "Access Control"}
            icon={FiShield}
            items={filteredAccessControlItems}
            collapsed={collapsed}
            currentPath={currentPath}
            onClick={handleItemClick}
          />
        )}
      </nav>
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
