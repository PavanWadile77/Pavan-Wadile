import { Timestamp, FieldValue } from "firebase/firestore";

export interface BaseModel {
  id?: string;
  createdAt?: Timestamp | Date | { seconds: number; nanoseconds: number } | FieldValue;
  updatedAt?: Timestamp | Date | { seconds: number; nanoseconds: number } | FieldValue;
}

export interface User extends BaseModel {
  email: string;
  role: "admin" | "user";
  displayName?: string;
  photoURL?: string;
}

export interface Project extends BaseModel {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  order?: number;
}

export interface Blog extends BaseModel {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
  views?: number;
}

export interface Achievement extends BaseModel {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  link?: string;
}

export interface Certificate extends BaseModel {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export interface Skill extends BaseModel {
  name: string;
  category: string; // e.g., "Frontend", "Backend", "Tools"
  iconUrl?: string;
  proficiency?: number; // 1-100
  order?: number;
}

export interface GalleryItem extends BaseModel {
  title?: string;
  description?: string;
  imageUrl: string;
  category: string; // e.g., "Hackathons", "Events"
}

export interface Testimonial extends BaseModel {
  name: string;
  role: string;
  company?: string;
  content: string;
  avatarUrl?: string;
}

export interface ContactMessage extends BaseModel {
  name: string;
  email: string;
  message: string;
  read: boolean;
}

export interface VisitorStat extends BaseModel {
  pageUrl: string;
  userAgent: string;
  browser: string;
  deviceType: string; // "desktop", "mobile", "tablet"
  country?: string;
  timestamp: Timestamp | Date | { seconds: number; nanoseconds: number } | FieldValue;
  visitorId: string; // generated client-side to distinguish unique vs page views
}

export interface SeoSetting extends BaseModel {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  ogImage: string;
  twitterHandle?: string;
}

export interface Resume extends BaseModel {
  title: string;
  fileUrl: string;
  version: string;
  isActive: boolean;
}

export interface SocialLink extends BaseModel {
  platform: string; // "github", "linkedin", etc.
  url: string;
  iconName?: string;
  isActive: boolean;
}

export interface SiteSetting extends BaseModel {
  key: string;
  value: string | number | boolean;
}
