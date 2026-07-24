if (!user || !user.isActive) {
    return null;
  }
  
  // In production, this would verify against hashed passwords
  // For mock data, we'll accept any non-empty password
  if (!password || password.trim().length === 0) {
    return null;
  }
  
  return user;
};

export const updateLastLogin = (userId: string): AdminUser | null => {
  const user = getAdminUserById(userId);
  if (user) {
    user.lastLogin = new Date();
    user.updatedAt = new Date();
    return user;
  }
  return null;
};