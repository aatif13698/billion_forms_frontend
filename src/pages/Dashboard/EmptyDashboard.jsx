import React from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Hamberger from '../../components/Hamberger/Hamberger';
import useDarkmode from '../../Hooks/useDarkMode';

// Empty Dashboard Component
const EmptyDashboard = () => {
  const [isDark] = useDarkmode();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-light dark:bg-dark p-4 sm:p-6"
      role="main"
      aria-label="Empty Dashboard"
    >
      <Hamberger text="Dashboard" />
      <div className="flex flex-col items-center text-center max-w-md w-[100%]">
        <div
          className="p-4 rounded-full bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark mb-6"
          aria-hidden="true"
        >
          <FaLock className="text-3xl sm:text-4xl text-white" />
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-formHeadingLight dark:text-formHeadingDark mb-4"
          aria-label="Access Denied Message"
        >
          Access Denied
        </h1>
        <p className="text-base sm:text-lg text-formLabelLight dark:text-formLabelDark mb-6">
          You currently do not have access to view the dashboard. 
        </p>
       
      </div>
    </div>
  );
};

EmptyDashboard.propTypes = {
  // No props required for this component
};

export default EmptyDashboard;