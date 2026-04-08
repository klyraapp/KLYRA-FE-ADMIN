/**
 * Layout Component
 * Global layout wrapper with Sidebar and Header
 * Provides consistent structure across all pages
 */

import { Drawer, Layout } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "../../../../styles/AppLayout.module.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const { Header: AntHeader, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCollapse = (value) => {
    setCollapsed(value);
  };

  const handleMenuClick = (key) => {
    if (key === "logout") {
      // Handle logout logic
    }
  };

  return (
    <Layout className={styles.layoutContainer}>
      <div className={styles.desktopSidebar}>
        <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
      </div>

      <Drawer
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        closable={false}
        width={280}
        styles={{ body: { padding: 0 } }}
        className={styles.mobileDrawer}
      >
        <Sidebar collapsed={false} onCollapse={() => setMobileOpen(false)} isMobile />
      </Drawer>

      <Layout
        className={`${styles.mainLayout} ${collapsed ? styles.mainLayoutCollapsed : ""}`}
      >
        <AntHeader className={styles.header}>
          <Header
            onMenuClick={handleMenuClick}
            onMobileMenuClick={() => setMobileOpen(true)}
          />
        </AntHeader>

        <Content className={styles.contentWrapper}>{children}</Content>
      </Layout>
    </Layout>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
