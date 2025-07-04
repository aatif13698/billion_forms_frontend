

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUsers, FaBuilding, FaClipboardList, FaChartLine, FaUserPlus, FaFileAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import dashboardService from '../../services/dashboardService';
import useDarkmode from '../../Hooks/useDarkMode';
import { useSelector } from 'react-redux';
import Hamberger from '../../components/Hamberger/Hamberger';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Chart.js plugin for dark mode title color
const darkModePlugin = {
  id: 'darkMode',
  beforeDraw(chart) {
    const { options } = chart;
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (options.plugins.title) {
      options.plugins.title.color = isDarkMode ? '#ffffff' : '#000000';
    }
  },
};
ChartJS.register(darkModePlugin);

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, isDark }) => (
  <div
    className="p-4 sm:p-6 rounded-lg shadow-md flex items-center space-x-4 bg-cardBgLight dark:bg-cardBgDark"
    role="region"
    aria-label={`${title} metric card`}
  >
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="text-xl sm:text-2xl text-white" aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-formLabelLight dark:text-formLabelDark">{title}</h3>
      <p className="text-xl sm:text-2xl font-semibold text-formLabelLight dark:text-formLabelDark">{value}</p>
    </div>
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const Dashboard = () => {
  const { companyId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark] = useDarkmode();
  const { clientUser: currentUser, isAuth: isLoggedIn } = useSelector((state) => state?.authCustomerSlice);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isLoggedIn || !currentUser?.role?.id) {
        setError('User is not authenticated or role is missing.');
        toast.error('Please log in to view the dashboard.');
        setLoading(false);
        return;
      }

      // if (!dashboardService.getDashboardDataForSuperAdmin || !dashboardService.getDashboardDataForClient) {
      //   console.error('dashboardService functions are not defined:', dashboardService);
      //   setError('Service configuration error. Please contact support.');
      //   toast.error('Service configuration error.');
      //   setLoading(false);
      //   return;
      // }

      try {
        setLoading(true);
        let response;
        if (currentUser.role.id === 1) {
          // if (!companyId) {
          //   setError('Company ID is missing for super admin.');
          //   toast.error('Company ID is missing.');
          //   setLoading(false);
          //   return;
          // }
          response = await dashboardService.getDashboardDataForSuperAdmin(companyId);
        } else if (currentUser.role.id === 2) {
          response = await dashboardService.getDashboardDataForClient();
        } else {
          throw new Error('Invalid user role.');
        }

        if (response?.data?.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error(response?.data?.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, isLoggedIn]);

  // Memoized chart data to prevent unnecessary re-renders
  const requestsChartData = useMemo(
    () => ({
      labels: ['Total Requests', 'Requests This Week'],
      datasets: [
        {
          label: 'Requests',
          data: [dashboardData?.requests || 0, dashboardData?.requestsThisWeek || 0],
          backgroundColor: ['#ffc001', '#ff9c01'],
          borderColor: ['#e6a700', '#e68a00'],
          borderWidth: 1,
        },
      ],
    }),
    [dashboardData?.requests, dashboardData?.requestsThisWeek]
  );

  const formsChartData = useMemo(
    () => ({
      labels: ['Total Forms', 'Forms This Week'],
      datasets: [
        {
          label: 'Forms Submitted',
          data: [dashboardData?.totalFormsSubmitted || 0, dashboardData?.totalFormsSubmittedThisWeek || 0],
          backgroundColor: ['#00ff85', '#6aff2c'],
          borderColor: ['#00cc6a', '#55cc22'],
          borderWidth: 1,
        },
      ],
    }),
    [dashboardData?.totalFormsSubmitted, dashboardData?.totalFormsSubmittedThisWeek]
  );

  const usersChartData = useMemo(
    () => ({
      labels: currentUser?.role?.id === 2 ? ['Users', 'Organizations'] : ['Clients', 'Users', 'Staffs', 'Leads'],
      datasets: [
        {
          data:
            currentUser?.role?.id === 2
              ? [dashboardData?.users || 0, dashboardData?.organizations || 0, dashboardData?.leads || 0]
              : [
                dashboardData?.clients || 0,
                dashboardData?.users || 0,
                dashboardData?.staffs || 0,
                dashboardData?.leads || 0,
              ],
          backgroundColor: ['#ffc001', '#ff9c01', '#00ff85', '#6aff2c'],
          borderColor: ['#e6a700', '#e68a00', '#00cc6a', '#55cc22'],
          borderWidth: 1,
        },
      ],
    }),
    [
      currentUser?.role?.id,
      dashboardData?.clients,
      dashboardData?.users,
      dashboardData?.organizations,
      dashboardData?.staffs,
      dashboardData?.leads,
    ]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5, // Adjusted for better mobile display
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: window.innerWidth < 640 ? 12 : 14, // Smaller font on mobile
            },
          },
        },
        title: {
          display: true,
          text: 'Activity Overview',
          font: {
            size: window.innerWidth < 640 ? 14 : 16, // Smaller title on mobile
          },
        },
      },
    }),
    []
  );

  const usersChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1, // Square aspect ratio for Doughnut chart
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: window.innerWidth < 640 ? 12 : 14,
            },
          },
        },
        title: {
          display: true,
          text: 'User Distribution',
          font: {
            size: window.innerWidth < 640 ? 14 : 16,
          },
        },
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" role="status" aria-live="polite">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen text-red-500 dark:text-red-300"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-light dark:bg-dark min-h-screen" role="main">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        theme="colored"
        className="text-formLabelLight dark:text-formLabelDark"
      />
      <Hamberger text={currentUser?.role?.id === 1 ? 'Super Admin Dashboard' : 'Client Dashboard'} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {currentUser?.role?.id === 1 && (
          <>
            <MetricCard
              title="Clients"
              value={dashboardData?.clients || 0}
              icon={FaUsers}
              color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
              isDark={isDark}
            />
            <MetricCard
              title="Staffs"
              value={dashboardData?.staffs || 0}
              icon={FaUsers}
              color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
              isDark={isDark}
            />
            <MetricCard
              title="Requests"
              value={dashboardData?.requests || 0}
              icon={FaClipboardList}
              color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
              isDark={isDark}
            />
            <MetricCard 
              title="Leads"
              value={dashboardData?.leads || 0}
              icon={FaChartLine}
              color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
              isDark={isDark}
            />
            <MetricCard
              title="Requests This Week"
              value={dashboardData?.requestsThisWeek || 0}
              icon={FaClipboardList}
              color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
              isDark={isDark}
            />
          </>
        )}
        <MetricCard
          title="Users"
          value={dashboardData?.users || 0}
          icon={FaUserPlus}
          color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
          isDark={isDark}
        />
        <MetricCard
          title="Organizations"
          value={dashboardData?.organizations || 0}
          icon={FaBuilding}
          color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
          isDark={isDark}
        />

        <MetricCard
          title="Total Forms Submitted"
          value={dashboardData?.totalFormsSubmitted || 0}
          icon={FaFileAlt}
          color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
          isDark={isDark}
        />
        <MetricCard
          title="Forms Submitted This Week"
          value={dashboardData?.totalFormsSubmittedThisWeek || 0}
          icon={FaFileAlt}
          color="bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
          isDark={isDark}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-20">
        {currentUser?.role?.id === 1 && (
          <>
            <div
              className="w-[100%] bg-cardBgLight dark:bg-cardBgDark p-4 sm:p-6 rounded-lg shadow-md"
              role="region"
              aria-label="Requests Overview Chart"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
                Requests Overview
              </h2>
              <div className="w-[100%] h-[200px] sm:h-[300px]">
                <Bar data={requestsChartData} options={chartOptions} />
              </div>
            </div>
            <div
              className="w-[100%] bg-cardBgLight dark:bg-cardBgDark p-4 sm:p-6 rounded-lg shadow-md"
              role="region"
              aria-label="Forms Submission Overview Chart"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
                Forms Submission Overview
              </h2>
              <div className="w-[100%] h-[200px] sm:h-[300px]">
                <Bar data={formsChartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
        <div
          className="w-[100%] bg-cardBgLight dark:bg-cardBgDark p-4 sm:p-6 rounded-lg shadow-md"
          role="region"
          aria-label="User Distribution Chart"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
            User Distribution
          </h2>
          <div className="w-[100%] h-[200px] sm:h-[300px]">
            <Doughnut data={usersChartData} options={usersChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  companyId: PropTypes.string,
};

export default Dashboard;