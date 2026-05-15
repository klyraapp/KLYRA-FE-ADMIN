/**
 * Header Component
 * Top navigation bar with search and user actions
 * Pixel-perfect implementation matching the design
 */

import { logout } from "@/redux/reducers/authSlice";
// `useTheme` import kept commented along with the dark-mode toggle below.
// import { useTheme } from "@/theme/ThemeProvider";
import { deleteCookie } from "@/utils/utils";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
// `Switch` is intentionally not imported — dark-mode toggle is commented out below.
import { Avatar, Dropdown } from "antd";
import Logo from "@/components/common/Logo/Logo";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { FiBell, FiMenu, FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../../styles/Header.module.css";

const Header = ({ onMenuClick, onMobileMenuClick }) => {
  // Dark-mode toggle is currently disabled in the UI; see commented Switch below.
  // const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { profileData } = useSelector((state) => state.users);

  const handleNotificationClick = useCallback(() => {
    if (onMenuClick) {
      onMenuClick("notifications");
    }
  }, [onMenuClick]);

  const handleSettingsClick = useCallback(() => {
    router.push("/settings");
  }, [router]);

  const handleLogout = useCallback(() => {
    // Clear Cookies first so the new page knows we are logged out
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    localStorage.removeItem("rememberedEmail");
    
    // Perform a full page reload. This clears all in-memory states (Redux, React Query, etc.)
    // without the immediate UI "flicker" caused by manual dispatching.
    window.location.href = "/login";
  }, []);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const dropdownItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: handleProfileClick,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.mobileMenuBtn}
        onClick={onMobileMenuClick}
        aria-label="Toggle mobile menu"
      >
        <FiMenu className={styles.actionIcon} />
      </button>

      <div className={styles.spacer} />

      <div className={styles.rightSection}>
        {/* <div className={styles.searchWrapper}>
          <Input
            className={styles.searchInput}
            placeholder="Search Keywords..."
            suffix={<FiSearch className={styles.searchIcon} />}
          />
        </div> */}

        <div className={styles.actionsWrapper}>
          {/* Dark-mode toggle temporarily disabled.
          <Switch
            className={styles.themeToggle}
            checked={isDarkMode}
            onChange={toggleTheme}
            size="small"
          />
          */}

          <button
            type="button"
            className={styles.iconButton}
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <FiBell className={styles.actionIcon} />
          </button>

          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              className={styles.userAvatar}
              icon={<Logo width={20} height={20} priority={false} />}
              alt={profileData?.profileName || "User profile"}
              size={32}
              style={{ cursor: "pointer", backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            />
          </Dropdown>

          <button
            type="button"
            className={styles.iconButton}
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            <FiSettings className={styles.actionIcon} />
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func,
  onMobileMenuClick: PropTypes.func,
};

Header.defaultProps = {
  onMenuClick: null,
  onMobileMenuClick: null,
};

export default Header;
