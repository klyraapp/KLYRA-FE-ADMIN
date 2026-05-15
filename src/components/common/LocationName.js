/**
 * LocationName Component
 * Resolves serviceLocationId to its name using LocationContext.
 */

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import PropTypes from 'prop-types';

const LocationName = ({ id }) => {
  const { getLocationName } = useLocation();

  if (Array.isArray(id)) {
    return <>{id.map((item) => getLocationName(item)).join(", ")}</>;
  }

  return <>{getLocationName(id)}</>;
};

LocationName.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LocationName;
