if (!email || typeof email !== 'string') {
    return undefined;
  }
  return mockAdminUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const getDashboardMetrics = (): DashboardMetric[] => {
  return [...mockDashboardMetrics];
};

export const getRecentActivity = (limit?: number): RecentActivity[] => {
  const activities = [...mockRecentActivity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (limit && typeof limit === 'number' && limit > 0) {
    return activities.slice(0, limit);
  }
  
  return activities;
};

export const getActivityByType = (type: RecentActivity['type']): RecentActivity[] => {
  if (!type) {
    return [];
  }
  return mockRecentActivity.filter(activity => activity.type === type);
};

export const isValidAdminUser = (email: string, password: string): boolean => {
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return false;
  }
  
  const user = getAdminUserByEmail(email);
  return user?.isActive === true;
};

export const updateUserLastLogin = (email: string): AdminUser | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const userIndex = mockAdminUsers.findIndex(
    user => user.email.toLowerCase() === email.toLowerCase()
  );
  
  if (userIndex !== -1) {
    mockAdminUsers[userIndex].lastLogin = new Date().toISOString();
    return { ...mockAdminUsers[userIndex] };
  }
  
  return null;
};