/**
 * Logo Component
 * Unified brand logo handling with next/image optimization
 */

import Image from "next/image";
import PropTypes from "prop-types";
import { memo } from "react";

const Logo = ({
  width = 120,
  height = 40,
  className = "",
  priority = true,
  alt = "KLYRA Logo",
  style = {},
}) => (
  <div className={className} style={{ display: "flex", justifyContent: "center", alignItems: "center", ...style }}>
    <Image
      src="/images/klayra_logo.svg"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      style={{ objectFit: "contain" }}
    />
  </div>
);

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  priority: PropTypes.bool,
  alt: PropTypes.string,
  style: PropTypes.object,
};

export default memo(Logo);
