import { pgTable, text, serial, integer, boolean, timestamp, json, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  websiteUrl: text("website_url"),
  portfolioUrl: text("portfolio_url"),
  programmingLanguages: json("programming_languages").$type<string[]>(),
  expertise: json("expertise").$type<string[]>(),
  avatar: text("avatar"),
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Thread schema
export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isClosed: boolean("is_closed").default(false),
});

// Post schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  threadId: integer("thread_id").notNull().references(() => threads.id),
  parentId: integer("parent_id").references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// Votes schema
export const votes = pgTable("votes", {
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  value: integer("value").notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.postId] }),
  };
});

// Subscriptions schema
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  threadId: integer("thread_id").references(() => threads.id),
  categoryId: integer("category_id").references(() => categories.id),
  notifyByEmail: boolean("notify_by_email").default(true),
  notifyInPlatform: boolean("notify_in_platform").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'thread_reply', 'post_reply', 'mention', etc.
  content: text("content").notNull(),
  relatedId: integer("related_id"), // ID of the related thread/post
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Flags schema for moderation
export const flags = pgTable("flags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  reason: text("reason").notNull(),
  status: text("status").default("pending"), // 'pending', 'resolved', 'dismissed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Badges schema
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Icon name from Lucide icons or URL to custom icon
  color: text("color").notNull(), // Color in hex or CSS color name
  category: text("category").notNull(), // 'achievement', 'participation', 'moderation', etc.
  level: integer("level").notNull().default(1), // 1=bronze, 2=silver, 3=gold
  reputationPoints: integer("reputation_points").notNull().default(0), // Rep points awarded when badge is earned
  criteria: json("criteria").$type<{
    type: string;
    threshold: number;
    additionalParams?: Record<string, any>;
  }>().notNull(), // JSON with badge earning criteria
  createdAt: timestamp("created_at").defaultNow(),
});

// User Badges schema - track which users have earned which badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  displayOnProfile: boolean("display_on_profile").default(true),
}, (table) => {
  return {
    uniquePair: primaryKey({ columns: [table.userId, table.badgeId] }),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, reputation: true });

export const insertCategorySchema = createInsertSchema(categories)
  .omit({ id: true, createdAt: true });

export const insertThreadSchema = createInsertSchema(threads)
  .omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, isPinned: true, isClosed: true });

export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, createdAt: true, updatedAt: true, isDeleted: true });

export const insertVoteSchema = createInsertSchema(votes)
  .omit({ createdAt: true });

export const insertSubscriptionSchema = createInsertSchema(subscriptions)
  .omit({ id: true, createdAt: true });

export const insertNotificationSchema = createInsertSchema(notifications)
  .omit({ id: true, isRead: true, createdAt: true });

export const insertFlagSchema = createInsertSchema(flags)
  .omit({ id: true, status: true, createdAt: true });

export const insertBadgeSchema = createInsertSchema(badges)
  .omit({ id: true, createdAt: true });

export const insertUserBadgeSchema = createInsertSchema(userBadges)
  .omit({ id: true, earnedAt: true });

// Inferred types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Thread = typeof threads.$inferSelect;
export type InsertThread = z.infer<typeof insertThreadSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Flag = typeof flags.$inferSelect;
export type InsertFlag = z.infer<typeof insertFlagSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

// Auth-related schemas
export type LoginCredentials = {
  email: string;
  password: string;
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
