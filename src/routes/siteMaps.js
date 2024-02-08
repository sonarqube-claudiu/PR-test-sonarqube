export const dashboardRoutes = {
  label: 'Dashboard',
  labelDisable: true,
  children: [
    {
      name: 'Dashboard',
      active: true,
      icon: 'chart-pie',
      children: [
        {
          name: 'Default',
          to: '/',
          exact: true,
          active: true
        },
        {
          name: 'Analytics',
          to: '/dashboard/analytics',
          active: true
        },
        {
          name: 'CRM',
          to: '/dashboard/crm',
          active: true
        },
        {
          name: 'E Commerce',
          to: '/dashboard/e-commerce',
          active: true
        },
        {
          name: 'LMS',
          to: '/dashboard/lms',
          active: true,
          badge: {
            type: 'success',
            text: 'New'
          }
        },
        {
          name: 'Management',
          to: '/dashboard/project-management',
          active: true
        },
        {
          name: 'SaaS',
          to: '/dashboard/saas',
          active: true
        },
        {
          name: 'Support desk',
          to: '/dashboard/support-desk',
          active: true,
          badge: {
            type: 'success',
            text: 'New'
          }
        }
      ]
    }
  ]
};
export const appRoutes = {
  label: 'sidebar.button.main',
  children: [
    {
      name: 'sidebar.button.projects',
      icon: 'table',
      to: '/projects',
      active: true
    },
    {
      name: 'sidebar.button.issues',
      icon: ['fab', 'trello'],
      to: '/',
      active: true
    },
    {
      name: 'sidebar.button.focusPeriod',
      icon: 'clock',
      to: '/admin/focus-periods',
      active: true
    },
    // {
    //   name: 'sidebar.button.sprints',
    //   icon: ['far', 'clock'],
    //   to: '/admin/sprints',
    //   active: true
    // },
    {
      name: 'sidebar.button.groups',
      icon: 'users',
      to: '/admin/groups',
      active: true
    }
    // {
    //   name: 'Calendar',
    //   icon: 'calendar-alt',
    //   to: '/calendar',
    //   active: true
    // },
  ]
};




export default [
  appRoutes,
];
