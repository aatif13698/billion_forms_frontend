import {
  FaRegBuilding,
  FaUser,
  FaUserTie,
  FaUserPlus,
  FaUserCheck,
} from 'react-icons/fa';
import { AiOutlineDashboard } from "react-icons/ai";
import { FaUsersViewfinder } from "react-icons/fa6";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { MdOutlineSubscriptions } from "react-icons/md";
import { BsPersonVcardFill } from "react-icons/bs";
import { IoMdPersonAdd } from "react-icons/io";







// Mapping of menu names to icons
export const menuIconMap = {
  Dashboard: AiOutlineDashboard,
  Organization: FaRegBuilding,
  User: BsPersonVcardFill,
  Staff: FaUserTie,
  Requests: FaUserPlus,
  Clients: FaUserCheck,
  Companies: FaUsersViewfinder,
  Subscription: PiPaperPlaneTiltFill,
  Topup: FaArrowUpFromBracket,
  Subscribed: MdOutlineSubscriptions,
  'Roles & Permissions': FaUser,
  Leads : IoMdPersonAdd
};

// Mapping of menu links to additional active routes
export const additionalActiveRoutes = {
  '/list/clients': ['/list/clients', '/create/clients', '/update/clients', '/view/clients'],
  '/list/user': ['/list/user', '/update/user', '/view/user', '/create/user'],
  '/list/staff': ['/list/staff', '/create/staffs', '/view/staffs'],
  '/list/organization': [
    '/list/organization',
    '/create/organization',
    '/view/organization',
    '/list/fields',
    '/assign/user',
    '/list/adjustOrder',
    '/list/forms',
    '/editformbyadmin',
  ],
  '/list/requests': ['/list/requests', '/view/request'],
  '/list/companies': ['/list/companies', '/create/companies', '/update/companies', '/view/companies'],
  '/list/subscription': ['/list/subscription', '/create/subscription', '/update/subscription', '/view/subscription'],
  '/list/topup': ['/list/topup', '/create/topup'],
  '/list/subscribed': ['/list/subscribed', '/create/subscribed', '/view/subscribed'],
  '/list/permissions': ['/list/permissions', '/assign/permissions'],
};

// Generate menu items based on capability and role
export const generateMenuItems = (capability, roleId) => {
  const items = [
    { id: 'dashboard', title: 'Dashboard', icon: AiOutlineDashboard, link: '/dashboard' },
  ];

  if (roleId === 1 && capability?.length > 0) {
    const adminCapability = capability.find((cap) => cap.name === 'Administration');
    if (adminCapability?.access) {
      adminCapability.menu.forEach((menu, index) => {
        if (menu.access) {
          const name = menu.name;
          const menuName = name === 'Roles & Permissions' ? 'Permissions' : name;
          
          const link =
            menuName === 'Roles & Permissions'
              ? '/list/rolesPermissions'
              : menuName === 'Dashboard'
              ? '/dashboard'
              : `/list/${menuName.toLowerCase()}`;
          items.push({
            id: `menu-${index + 1}`,
            title: menuName,
            icon: menuIconMap[menuName] || FaUser,
            link,
          });
        }
      });
    }
  } else if (roleId === 2) {
    items.push(
      {
        id: 'organization',
        title: 'Organization',
        icon: FaRegBuilding,
        link: '/list/organization',
      },
      { id: 'user', title: 'User', icon: FaUser, link: '/list/user' }
    );
  } else if (roleId === 3) {
    items.push({
      id: 'organization',
      title: 'Organization',
      icon: FaRegBuilding,
      link: '/list/organization',
    });
  }

  return items;
};