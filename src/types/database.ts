// Service types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCreateInput {
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featured?: boolean;
  published?: boolean;
}

export interface ServiceUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  image?: string;
  featured?: boolean;
  published?: boolean;
}

// Portfolio types
export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Career types
export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
