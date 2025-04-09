// Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useWidth from '../../Hooks/useWidth';
import useDarkMode from '../../Hooks/useDarkMode';
import defaultLogo from '../../assets/logo/logo.png'; // Renamed to avoid naming conflict

const Logo = ({
  logoSrc = defaultLogo,          // Default logo image
  altText = 'Logo',              // Accessibility
  to = '/',                      // Default route
  icon: IconComponent,           // Optional icon component
  width: customWidth = '100%',   // Container width
  height = '3.5rem',            // Container height (14 in tailwind)
  imgStyles = {},                // Custom styles for image
  iconStyles = {},               // Custom styles for icon
  containerStyles = {},          // Custom styles for container
  breakpoint = 'lg',             // Custom breakpoint
  className = '',                // Additional classes
  ...props                       // Additional props
}) => {
  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkMode();

  // Determine if we're below the specified breakpoint
  const isSmallScreen = width < breakpoints[breakpoint];

  // Base container styles
  const baseContainerStyles = {
    width: customWidth,
    height,
    ...containerStyles,
  };

  // Dynamic logo rendering
  const renderLogo = () => {
    if (isSmallScreen && IconComponent) {
      return (
        <IconComponent
          className="h-auto w-auto"
          style={{
            color: isDark ? '#ffffff' : '#000000', // Dynamic color based on dark mode
            ...iconStyles,
          }}
        />
      );
    }
    
    return (
      <img
        src={logoSrc}
        alt={altText}
        className=" w-auto object-contain"
        style={{
          ...imgStyles,
          filter: isDark ? 'brightness(1.2)' : 'none', // Optional dark mode adjustment
        }}
      />
    );
  };

  return (
    <div
      className={`flex items-center pl-5 py-3 ${className}`.trim()}
      style={baseContainerStyles}
    >
      <Link to={to} {...props}>
        {renderLogo()}
      </Link>
    </div>
  );
};

// PropTypes for type checking and documentation
Logo.propTypes = {
  logoSrc: PropTypes.string,
  altText: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.elementType,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imgStyles: PropTypes.object,
  iconStyles: PropTypes.object,
  containerStyles: PropTypes.object,
  breakpoint: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

// Default props (optional, shown for clarity)
Logo.defaultProps = {
  logoSrc: defaultLogo,
  altText: 'Logo',
  to: '/',
  width: '100%',
  height: '3.5rem',
  imgStyles: {},
  iconStyles: {},
  containerStyles: {},
  breakpoint: 'lg',
  className: '',
};

export default Logo;