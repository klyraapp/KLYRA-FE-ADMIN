/**
 * PageGuard Component
 * Page-level permission protection.
 * Redirects unauthorized users to /404.
 */

import usePermission from "@/hooks/usePermission";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Protects an entire page by checking permissions before rendering.
 * Redirects to /404 if the user lacks the required permission.
 *
 * @example
 * const RolesPage = () => (
 *   <PageGuard permission="role:read">
 *     <RolesContent />
 *   </PageGuard>
 * );
 */
const PageGuard = ({
  permission,
  permissions,
  requireAll,
  children,
}) => {
  const { can, canAny, canAll } = usePermission();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const hasAccess = (() => {
    if (permission) {
      return can(permission);
    }

    if (permissions && permissions.length > 0) {
      return requireAll ? canAll(permissions) : canAny(permissions);
    }

    return true;
  })();

  useEffect(() => {
    if (!hasAccess) {
      router.replace("/404");
    } else {
      setIsChecking(false);
    }
  }, [hasAccess, router]);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return children;
};

PageGuard.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

PageGuard.defaultProps = {
  permission: null,
  permissions: [],
  requireAll: false,
};

export default memo(PageGuard);
