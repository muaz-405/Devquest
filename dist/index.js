// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  categories;
  threads;
  posts;
  votes;
  subscriptions;
  notifications;
  flags;
  badges;
  userBadges;
  userId = 1;
  categoryId = 1;
  threadId = 1;
  postId = 1;
  subscriptionId = 1;
  notificationId = 1;
  flagId = 1;
  badgeId = 1;
  sessionStore;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.threads = /* @__PURE__ */ new Map();
    this.posts = /* @__PURE__ */ new Map();
    this.votes = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.notifications = /* @__PURE__ */ new Map();
    this.flags = /* @__PURE__ */ new Map();
    this.badges = /* @__PURE__ */ new Map();
    this.userBadges = /* @__PURE__ */ new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
    this.seedCategories();
    this.seedBadges();
  }
  // Seed basic badges
  async seedBadges() {
    const defaultBadges = [
      {
        name: "Newcomer",
        description: "Welcome to the community!",
        category: "account",
        level: 1,
        icon: "UserPlus",
        color: "#4CAF50",
        criteria: {
          type: "join",
          threshold: 1
        },
        reputationPoints: 5
      },
      {
        name: "First Post",
        description: "Share your first post",
        category: "participation",
        level: 1,
        icon: "MessageSquare",
        color: "#2196F3",
        criteria: {
          type: "posts",
          threshold: 1
        },
        reputationPoints: 5
      },
      {
        name: "First Thread",
        description: "Start your first discussion",
        category: "participation",
        level: 1,
        icon: "MessagesSquare",
        color: "#03A9F4",
        criteria: {
          type: "threads",
          threshold: 1
        },
        reputationPoints: 10
      },
      {
        name: "Helping Hand",
        description: "Get upvotes from the community",
        category: "reputation",
        level: 1,
        icon: "ThumbsUp",
        color: "#FFC107",
        criteria: {
          type: "upvotes",
          threshold: 10
        },
        reputationPoints: 15
      },
      {
        name: "Code Master",
        description: "Share quality code samples",
        category: "code",
        level: 2,
        icon: "Code",
        color: "#673AB7",
        criteria: {
          type: "code_samples",
          threshold: 5
        },
        reputationPoints: 25
      },
      {
        name: "Active Member",
        description: "Regularly participate in discussions",
        category: "participation",
        level: 2,
        icon: "CalendarClock",
        color: "#FF5722",
        criteria: {
          type: "posts",
          threshold: 25
        },
        reputationPoints: 20
      },
      {
        name: "Problem Solver",
        description: "Help others solve programming challenges",
        category: "reputation",
        level: 3,
        icon: "Lightbulb",
        color: "#E91E63",
        criteria: {
          type: "upvotes",
          threshold: 50
        },
        reputationPoints: 50
      }
    ];
    for (const badge of defaultBadges) {
      await this.createBadge(badge);
    }
  }
  // Seed basic categories
  async seedCategories() {
    const defaultCategories = [
      { name: "JavaScript", description: "Discussions about JavaScript language and ecosystem", color: "#f7df1e" },
      { name: "Python", description: "Python programming language discussions", color: "#306998" },
      { name: "React", description: "React.js framework discussions", color: "#61dafb" },
      { name: "DevOps", description: "DevOps practices and tools", color: "#6c5ce7" },
      { name: "Database", description: "Database systems and design", color: "#e74c3c" },
      { name: "Security", description: "Security concepts and best practices", color: "#f39c12" }
    ];
    for (const category of defaultCategories) {
      await this.createCategory(category);
    }
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return void 0;
  }
  async createUser(user) {
    const id = this.userId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newUser = {
      ...user,
      id,
      reputation: 0,
      createdAt: timestamp2
    };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateUser(id, data) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = {
      ...user,
      ...data
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Category operations
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategory(id) {
    return this.categories.get(id);
  }
  async createCategory(category) {
    const id = this.categoryId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newCategory = {
      ...category,
      id,
      createdAt: timestamp2
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  // Thread operations
  async getThreads(limit = 20, offset = 0) {
    const threads2 = Array.from(this.threads.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return threads2.slice(offset, offset + limit);
  }
  async getThreadsByCategory(categoryId, limit = 20, offset = 0) {
    const threads2 = Array.from(this.threads.values()).filter((thread) => thread.categoryId === categoryId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return threads2.slice(offset, offset + limit);
  }
  async getThreadsByUser(userId, limit = 20, offset = 0) {
    const threads2 = Array.from(this.threads.values()).filter((thread) => thread.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return threads2.slice(offset, offset + limit);
  }
  async getThread(id) {
    return this.threads.get(id);
  }
  async createThread(thread) {
    const id = this.threadId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newThread = {
      ...thread,
      id,
      createdAt: timestamp2,
      updatedAt: timestamp2,
      viewCount: 0,
      isPinned: false,
      isClosed: false
    };
    this.threads.set(id, newThread);
    return newThread;
  }
  async updateThread(id, data) {
    const thread = this.threads.get(id);
    if (!thread) return void 0;
    const updatedThread = {
      ...thread,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.threads.set(id, updatedThread);
    return updatedThread;
  }
  async incrementThreadViewCount(id) {
    const thread = this.threads.get(id);
    if (thread) {
      thread.viewCount += 1;
      this.threads.set(id, thread);
    }
  }
  // Post operations
  async getPosts(threadId, limit = 100, offset = 0) {
    const posts2 = Array.from(this.posts.values()).filter((post) => post.threadId === threadId && !post.isDeleted).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return posts2.slice(offset, offset + limit);
  }
  async getPostsByUser(userId, limit = 20, offset = 0) {
    const posts2 = Array.from(this.posts.values()).filter((post) => post.userId === userId && !post.isDeleted).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return posts2.slice(offset, offset + limit);
  }
  async getPost(id) {
    const post = this.posts.get(id);
    return post && !post.isDeleted ? post : void 0;
  }
  async createPost(post) {
    const id = this.postId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newPost = {
      ...post,
      id,
      createdAt: timestamp2,
      updatedAt: timestamp2,
      isDeleted: false
    };
    this.posts.set(id, newPost);
    const thread = this.threads.get(post.threadId);
    if (thread) {
      thread.updatedAt = timestamp2;
      this.threads.set(thread.id, thread);
    }
    return newPost;
  }
  async updatePost(id, data) {
    const post = this.posts.get(id);
    if (!post || post.isDeleted) return void 0;
    const updatedPost = {
      ...post,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  // Vote operations
  async getVotes(postId) {
    return Array.from(this.votes.values()).filter((vote) => vote.postId === postId);
  }
  async getUserVote(userId, postId) {
    const key = `${userId}-${postId}`;
    return this.votes.get(key);
  }
  async createOrUpdateVote(vote) {
    const key = `${vote.userId}-${vote.postId}`;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newVote = {
      ...vote,
      createdAt: timestamp2
    };
    this.votes.set(key, newVote);
    const post = this.posts.get(vote.postId);
    if (post) {
      const postOwner = this.users.get(post.userId);
      if (postOwner) {
        postOwner.reputation += vote.value;
        this.users.set(postOwner.id, postOwner);
      }
    }
    return newVote;
  }
  // Subscription operations
  async getSubscriptions(userId) {
    return Array.from(this.subscriptions.values()).filter((sub) => sub.userId === userId);
  }
  async getSubscription(userId, threadId, categoryId) {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId) {
        if (threadId && sub.threadId === threadId) return sub;
        if (categoryId && sub.categoryId === categoryId) return sub;
      }
    }
    return void 0;
  }
  async createSubscription(subscription) {
    const id = this.subscriptionId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newSubscription = {
      ...subscription,
      id,
      createdAt: timestamp2
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }
  async updateSubscription(id, data) {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return void 0;
    const updatedSubscription = {
      ...subscription,
      ...data
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  async deleteSubscription(id) {
    return this.subscriptions.delete(id);
  }
  // Notification operations
  async getNotifications(userId, limit = 20, offset = 0) {
    const notifications2 = Array.from(this.notifications.values()).filter((notification) => notification.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return notifications2.slice(offset, offset + limit);
  }
  async getUnreadNotificationCount(userId) {
    return Array.from(this.notifications.values()).filter((notification) => notification.userId === userId && !notification.isRead).length;
  }
  async createNotification(notification) {
    const id = this.notificationId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newNotification = {
      ...notification,
      id,
      isRead: false,
      createdAt: timestamp2
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  async markNotificationAsRead(id) {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }
  async markAllNotificationsAsRead(userId) {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId) {
        notification.isRead = true;
        this.notifications.set(id, notification);
      }
    }
  }
  // Flag operations
  async getFlags(limit = 20, offset = 0) {
    const flags2 = Array.from(this.flags.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return flags2.slice(offset, offset + limit);
  }
  async createFlag(flag) {
    const id = this.flagId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newFlag = {
      ...flag,
      id,
      status: "pending",
      createdAt: timestamp2
    };
    this.flags.set(id, newFlag);
    return newFlag;
  }
  async updateFlagStatus(id, status) {
    const flag = this.flags.get(id);
    if (!flag) return void 0;
    flag.status = status;
    this.flags.set(id, flag);
    return flag;
  }
  // Badge operations
  async getBadges(category, level) {
    let badges2 = Array.from(this.badges.values());
    if (category) {
      badges2 = badges2.filter((badge) => badge.category === category);
    }
    if (level) {
      badges2 = badges2.filter((badge) => badge.level === level);
    }
    return badges2.sort((a, b) => a.level - b.level);
  }
  async getBadge(id) {
    return this.badges.get(id);
  }
  async getBadgeByName(name) {
    for (const badge of this.badges.values()) {
      if (badge.name.toLowerCase() === name.toLowerCase()) {
        return badge;
      }
    }
    return void 0;
  }
  async createBadge(badge) {
    const id = this.badgeId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newBadge = {
      ...badge,
      id,
      createdAt: timestamp2
    };
    this.badges.set(id, newBadge);
    return newBadge;
  }
  async updateBadge(id, data) {
    const badge = this.badges.get(id);
    if (!badge) return void 0;
    const updatedBadge = {
      ...badge,
      ...data
    };
    this.badges.set(id, updatedBadge);
    return updatedBadge;
  }
  // User Badge operations
  async getUserBadges(userId) {
    const userBadges2 = [];
    for (const userBadge of this.userBadges.values()) {
      if (userBadge.userId === userId) {
        const badge = this.badges.get(userBadge.badgeId);
        if (badge) {
          userBadges2.push({
            ...userBadge,
            badge
          });
        }
      }
    }
    return userBadges2.sort((a, b) => {
      if (a.displayOnProfile && !b.displayOnProfile) return -1;
      if (!a.displayOnProfile && b.displayOnProfile) return 1;
      if (a.badge.level !== b.badge.level) return b.badge.level - a.badge.level;
      return (b.earnedAt?.getTime() || 0) - (a.earnedAt?.getTime() || 0);
    });
  }
  async getUserBadge(userId, badgeId) {
    const key = `${userId}-${badgeId}`;
    return this.userBadges.get(key);
  }
  async awardBadge(userBadge) {
    const key = `${userBadge.userId}-${userBadge.badgeId}`;
    const timestamp2 = /* @__PURE__ */ new Date();
    const existingBadge = this.userBadges.get(key);
    if (existingBadge) {
      return existingBadge;
    }
    const id = Math.floor(Math.random() * 1e6);
    const newUserBadge = {
      id,
      ...userBadge,
      earnedAt: timestamp2,
      displayOnProfile: true
      // By default, display the badge
    };
    this.userBadges.set(key, newUserBadge);
    const badge = this.badges.get(userBadge.badgeId);
    if (badge) {
      await this.createNotification({
        type: "badge",
        userId: userBadge.userId,
        content: `Congratulations! You've earned the "${badge.name}" badge: ${badge.description}`
      });
      const user = this.users.get(userBadge.userId);
      if (user) {
        user.reputation = (user.reputation || 0) + badge.reputationPoints;
        this.users.set(user.id, user);
      }
    }
    return newUserBadge;
  }
  async updateUserBadgeDisplay(userId, badgeId, display) {
    const key = `${userId}-${badgeId}`;
    const userBadge = this.userBadges.get(key);
    if (!userBadge) return void 0;
    userBadge.displayOnProfile = display;
    this.userBadges.set(key, userBadge);
    return userBadge;
  }
  // Reputation operations
  async getUserReputation(userId) {
    const user = this.users.get(userId);
    return user?.reputation || 0;
  }
  async updateUserReputation(userId, points) {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    user.reputation = (user.reputation || 0) + points;
    this.users.set(userId, user);
    await this.checkAndAwardBadges(userId);
    return user.reputation;
  }
  async getTopUsers(limit = 10) {
    return Array.from(this.users.values()).sort((a, b) => (b.reputation || 0) - (a.reputation || 0)).slice(0, limit);
  }
  async checkAndAwardBadges(userId) {
    const user = this.users.get(userId);
    if (!user) return [];
    const badgesAwarded = [];
    if (user.reputation >= 10) {
      const helpingHandBadge = await this.getBadgeByName("Helping Hand");
      if (helpingHandBadge) {
        const existing = await this.getUserBadge(userId, helpingHandBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: helpingHandBadge.id });
          badgesAwarded.push(helpingHandBadge);
        }
      }
    }
    if (user.reputation >= 50) {
      const problemSolverBadge = await this.getBadgeByName("Problem Solver");
      if (problemSolverBadge) {
        const existing = await this.getUserBadge(userId, problemSolverBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: problemSolverBadge.id });
          badgesAwarded.push(problemSolverBadge);
        }
      }
    }
    const userPosts = await this.getPostsByUser(userId);
    if (userPosts.length >= 1) {
      const firstPostBadge = await this.getBadgeByName("First Post");
      if (firstPostBadge) {
        const existing = await this.getUserBadge(userId, firstPostBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: firstPostBadge.id });
          badgesAwarded.push(firstPostBadge);
        }
      }
    }
    if (userPosts.length >= 25) {
      const activeMemberBadge = await this.getBadgeByName("Active Member");
      if (activeMemberBadge) {
        const existing = await this.getUserBadge(userId, activeMemberBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: activeMemberBadge.id });
          badgesAwarded.push(activeMemberBadge);
        }
      }
    }
    const userThreads = await this.getThreadsByUser(userId);
    if (userThreads.length >= 1) {
      const firstThreadBadge = await this.getBadgeByName("First Thread");
      if (firstThreadBadge) {
        const existing = await this.getUserBadge(userId, firstThreadBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: firstThreadBadge.id });
          badgesAwarded.push(firstThreadBadge);
        }
      }
    }
    return badgesAwarded;
  }
  // Search operations
  async searchThreads(query, limit = 20, offset = 0) {
    const lowercaseQuery = query.toLowerCase();
    const threads2 = Array.from(this.threads.values()).filter((thread) => thread.title.toLowerCase().includes(lowercaseQuery)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return threads2.slice(offset, offset + limit);
  }
  async searchPosts(query, limit = 20, offset = 0) {
    const lowercaseQuery = query.toLowerCase();
    const posts2 = Array.from(this.posts.values()).filter((post) => !post.isDeleted && post.content.toLowerCase().includes(lowercaseQuery)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return posts2.slice(offset, offset + limit);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  websiteUrl: text("website_url"),
  portfolioUrl: text("portfolio_url"),
  programmingLanguages: json("programming_languages").$type(),
  expertise: json("expertise").$type(),
  avatar: text("avatar"),
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isClosed: boolean("is_closed").default(false)
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  threadId: integer("thread_id").notNull().references(() => threads.id),
  parentId: integer("parent_id").references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false)
});
var votes = pgTable("votes", {
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  value: integer("value").notNull(),
  // 1 for upvote, -1 for downvote
  createdAt: timestamp("created_at").defaultNow()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.postId] })
  };
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  threadId: integer("thread_id").references(() => threads.id),
  categoryId: integer("category_id").references(() => categories.id),
  notifyByEmail: boolean("notify_by_email").default(true),
  notifyInPlatform: boolean("notify_in_platform").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // 'thread_reply', 'post_reply', 'mention', etc.
  content: text("content").notNull(),
  relatedId: integer("related_id"),
  // ID of the related thread/post
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var flags = pgTable("flags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  reason: text("reason").notNull(),
  status: text("status").default("pending"),
  // 'pending', 'resolved', 'dismissed'
  createdAt: timestamp("created_at").defaultNow()
});
var badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  // Icon name from Lucide icons or URL to custom icon
  color: text("color").notNull(),
  // Color in hex or CSS color name
  category: text("category").notNull(),
  // 'achievement', 'participation', 'moderation', etc.
  level: integer("level").notNull().default(1),
  // 1=bronze, 2=silver, 3=gold
  reputationPoints: integer("reputation_points").notNull().default(0),
  // Rep points awarded when badge is earned
  criteria: json("criteria").$type().notNull(),
  // JSON with badge earning criteria
  createdAt: timestamp("created_at").defaultNow()
});
var userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  displayOnProfile: boolean("display_on_profile").default(true)
}, (table) => {
  return {
    uniquePair: primaryKey({ columns: [table.userId, table.badgeId] })
  };
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, reputation: true });
var insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
var insertThreadSchema = createInsertSchema(threads).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, isPinned: true, isClosed: true });
var insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true, isDeleted: true });
var insertVoteSchema = createInsertSchema(votes).omit({ createdAt: true });
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });
var insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, isRead: true, createdAt: true });
var insertFlagSchema = createInsertSchema(flags).omit({ id: true, status: true, createdAt: true });
var insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
var insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z as z2 } from "zod";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "forum-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !await comparePasswords(password, user.password)) {
            return done(null, false, { message: "Invalid email or password" });
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const registerSchema = insertUserSchema.extend({
        passwordConfirm: z2.string()
      }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords don't match",
        path: ["passwordConfirm"]
      });
      const userData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const { passwordConfirm, ...userDataToSave } = userData;
      const user = await storage.createUser({
        ...userDataToSave,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      if (err instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/lib/codeHighlight.ts
async function highlightCode(content) {
  if (!content) return "";
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  return content.replace(codeBlockRegex, (match, language, code) => {
    return `<pre class="language-${language || "plaintext"}"><code>${escapeHtml(code.trim())}</code></pre>`;
  });
}
function escapeHtml(html) {
  return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/categories", async (_req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (err) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });
  app2.get("/api/threads", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const threads2 = await storage.getThreads(limit, offset);
      const threadsWithDetails = await Promise.all(threads2.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts2 = await storage.getPosts(thread.id);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts2.length
        };
      }));
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching threads" });
    }
  });
  app2.get("/api/threads/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const allThreads = await storage.getThreads();
      const sortedThreads = [...allThreads].sort((a, b) => {
        const viewsA = a.viewCount || 0;
        const viewsB = b.viewCount || 0;
        return viewsB - viewsA;
      }).slice(offset, offset + limit);
      const threadsWithDetails = await Promise.all(sortedThreads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts2 = await storage.getPosts(thread.id);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts2.length
        };
      }));
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching popular threads" });
    }
  });
  app2.get("/api/threads/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const allThreads = await storage.getThreads();
      const sortedThreads = [...allThreads].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }).slice(offset, offset + limit);
      const threadsWithDetails = await Promise.all(sortedThreads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts2 = await storage.getPosts(thread.id);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts2.length
        };
      }));
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching recent threads" });
    }
  });
  app2.get("/api/categories/:id/threads", async (req, res) => {
    try {
      const categoryId = Number(req.params.id);
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const category = await storage.getCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const threads2 = await storage.getThreadsByCategory(categoryId, limit, offset);
      const threadsWithDetails = await Promise.all(threads2.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const posts2 = await storage.getPosts(thread.id);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: { id: category.id, name: category.name, color: category.color },
          replyCount: posts2.length
        };
      }));
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching threads" });
    }
  });
  app2.get("/api/threads/:id", async (req, res) => {
    try {
      const threadId = Number(req.params.id);
      const thread = await storage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      await storage.incrementThreadViewCount(threadId);
      const user = await storage.getUser(thread.userId);
      const category = await storage.getCategory(thread.categoryId);
      const threadWithDetails = {
        ...thread,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
        category: category ? { id: category.id, name: category.name, color: category.color } : null
      };
      res.json(threadWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching thread" });
    }
  });
  app2.post("/api/threads", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a thread" });
      }
      const data = insertThreadSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const thread = await storage.createThread(data);
      if (req.body.content) {
        await storage.createPost({
          content: req.body.content,
          threadId: thread.id,
          userId: req.user.id
        });
      }
      await storage.createSubscription({
        userId: req.user.id,
        threadId: thread.id,
        notifyByEmail: true,
        notifyInPlatform: true
      });
      res.status(201).json(thread);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating thread" });
    }
  });
  app2.put("/api/threads/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update a thread" });
      }
      const threadId = Number(req.params.id);
      const thread = await storage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.userId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this thread" });
      }
      const updatedThread = await storage.updateThread(threadId, req.body);
      res.json(updatedThread);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error updating thread" });
    }
  });
  app2.get("/api/threads/:id/posts", async (req, res) => {
    try {
      const threadId = Number(req.params.id);
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const thread = await storage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      const posts2 = await storage.getPosts(threadId, limit, offset);
      const postsWithDetails = await Promise.all(posts2.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const votes2 = await storage.getVotes(post.id);
        const userVote = req.isAuthenticated() ? await storage.getUserVote(req.user.id, post.id) : void 0;
        const score = votes2.reduce((sum, vote) => sum + vote.value, 0);
        const contentWithHighlightedCode = await highlightCode(post.content);
        return {
          ...post,
          content: contentWithHighlightedCode,
          user: user ? {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            reputation: user.reputation
          } : null,
          score,
          userVote: userVote ? userVote.value : 0
        };
      }));
      res.json(postsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  });
  app2.post("/api/threads/:id/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a post" });
      }
      const threadId = Number(req.params.id);
      const thread = await storage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "This thread is closed for new posts" });
      }
      const data = insertPostSchema.parse({
        ...req.body,
        userId: req.user.id,
        threadId
      });
      const post = await storage.createPost(data);
      if (thread.userId !== req.user.id) {
        await storage.createNotification({
          userId: thread.userId,
          type: "thread_reply",
          content: `${req.user.name} replied to your thread "${thread.title}"`,
          relatedId: post.id
        });
      }
      if (data.parentId) {
        const parentPost = await storage.getPost(data.parentId);
        if (parentPost && parentPost.userId !== req.user.id) {
          await storage.createNotification({
            userId: parentPost.userId,
            type: "post_reply",
            content: `${req.user.name} replied to your post`,
            relatedId: post.id
          });
        }
      }
      const subscriptions2 = Array.from((await storage.getSubscriptions(thread.userId)).values()).filter(
        (sub) => (sub.threadId === threadId || sub.categoryId === thread.categoryId) && sub.userId !== req.user.id
      );
      for (const sub of subscriptions2) {
        await storage.createNotification({
          userId: sub.userId,
          type: "subscription",
          content: `New activity in subscribed thread "${thread.title}"`,
          relatedId: post.id
        });
      }
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating post" });
    }
  });
  app2.put("/api/posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update a post" });
      }
      const postId = Number(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.userId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this post" });
      }
      const updatedPost = await storage.updatePost(postId, { content: req.body.content });
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: "Error updating post" });
    }
  });
  app2.delete("/api/posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete a post" });
      }
      const postId = Number(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.userId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
      }
      await storage.updatePost(postId, { isDeleted: true });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error deleting post" });
    }
  });
  app2.post("/api/posts/:id/vote", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to vote" });
      }
      const postId = Number(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.userId === req.user.id) {
        return res.status(403).json({ message: "You cannot vote on your own posts" });
      }
      const data = insertVoteSchema.parse({
        userId: req.user.id,
        postId,
        value: req.body.value === 1 ? 1 : -1
      });
      const vote = await storage.createOrUpdateVote(data);
      const votes2 = await storage.getVotes(postId);
      const score = votes2.reduce((sum, v) => sum + v.value, 0);
      res.json({ vote, score });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating vote" });
    }
  });
  app2.get("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view subscriptions" });
      }
      const subscriptions2 = await storage.getSubscriptions(req.user.id);
      const subscriptionsWithDetails = await Promise.all(subscriptions2.map(async (sub) => {
        let thread = null;
        let category = null;
        if (sub.threadId) {
          thread = await storage.getThread(sub.threadId);
        }
        if (sub.categoryId) {
          category = await storage.getCategory(sub.categoryId);
        }
        return {
          ...sub,
          thread: thread ? { id: thread.id, title: thread.title } : null,
          category: category ? { id: category.id, name: category.name } : null
        };
      }));
      res.json(subscriptionsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching subscriptions" });
    }
  });
  app2.post("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to subscribe" });
      }
      const data = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const existing = await storage.getSubscription(
        req.user.id,
        data.threadId,
        data.categoryId
      );
      if (existing) {
        return res.status(400).json({ message: "Already subscribed" });
      }
      const subscription = await storage.createSubscription(data);
      res.status(201).json(subscription);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating subscription" });
    }
  });
  app2.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to unsubscribe" });
      }
      const subscriptionId = Number(req.params.id);
      const subscription = await storage.getSubscription(req.user.id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      if (subscription.userId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this subscription" });
      }
      await storage.deleteSubscription(subscriptionId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error deleting subscription" });
    }
  });
  app2.get("/api/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view notifications" });
      }
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const notifications2 = await storage.getNotifications(req.user.id, limit, offset);
      res.json(notifications2);
    } catch (err) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view notifications" });
      }
      const count = await storage.getUnreadNotificationCount(req.user.id);
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: "Error fetching notification count" });
    }
  });
  app2.put("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update notifications" });
      }
      const notificationId = Number(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error updating notification" });
    }
  });
  app2.put("/api/notifications/mark-all-read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update notifications" });
      }
      await storage.markAllNotificationsAsRead(req.user.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error updating notifications" });
    }
  });
  app2.post("/api/posts/:id/flag", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to flag content" });
      }
      const postId = Number(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const data = insertFlagSchema.parse({
        userId: req.user.id,
        postId,
        reason: req.body.reason
      });
      const flag = await storage.createFlag(data);
      res.status(201).json(flag);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating flag" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.trim().length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters" });
      }
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const threads2 = await storage.searchThreads(query, limit, offset);
      const threadsWithDetails = await Promise.all(threads2.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name } : null,
          category: category ? { id: category.id, name: category.name } : null
        };
      }));
      const posts2 = await storage.searchPosts(query, limit, offset);
      const postsWithDetails = await Promise.all(posts2.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const thread = await storage.getThread(post.threadId);
        return {
          ...post,
          user: user ? { id: user.id, name: user.name } : null,
          thread: thread ? { id: thread.id, title: thread.title } : null
        };
      }));
      res.json({
        threads: threadsWithDetails,
        posts: postsWithDetails
      });
    } catch (err) {
      res.status(500).json({ message: "Error performing search" });
    }
  });
  app2.get("/api/users/:id/profile", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userProfile } = user;
      const threads2 = await storage.getThreadsByUser(userId, 5);
      const posts2 = await storage.getPostsByUser(userId, 5);
      res.json({
        ...userProfile,
        threads: threads2,
        posts: posts2
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });
  app2.put("/api/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      const { password, email, ...updateData } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (err) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  app2.get("/api/badges", async (req, res) => {
    try {
      const category = req.query.category;
      const level = req.query.level ? Number(req.query.level) : void 0;
      const badges2 = await storage.getBadges(category, level);
      res.json(badges2);
    } catch (err) {
      res.status(500).json({ message: "Error fetching badges" });
    }
  });
  app2.get("/api/badges/:id", async (req, res) => {
    try {
      const badge = await storage.getBadge(Number(req.params.id));
      if (!badge) {
        return res.status(404).json({ message: "Badge not found" });
      }
      res.json(badge);
    } catch (err) {
      res.status(500).json({ message: "Error fetching badge" });
    }
  });
  app2.get("/api/users/:id/badges", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userBadges2 = await storage.getUserBadges(userId);
      res.json(userBadges2);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user badges" });
    }
  });
  app2.put("/api/users/:userId/badges/:badgeId/display", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to manage badges" });
      }
      const userId = Number(req.params.userId);
      if (userId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own badges" });
      }
      const badgeId = Number(req.params.badgeId);
      const display = Boolean(req.body.display);
      const userBadge = await storage.updateUserBadgeDisplay(userId, badgeId, display);
      if (!userBadge) {
        return res.status(404).json({ message: "Badge not found or not awarded to user" });
      }
      res.json(userBadge);
    } catch (err) {
      res.status(500).json({ message: "Error updating badge display" });
    }
  });
  app2.get("/api/users/top", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const topUsers = await storage.getTopUsers(limit);
      const cleanedUsers = topUsers.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        reputation: user.reputation
      }));
      res.json(cleanedUsers);
    } catch (err) {
      res.status(500).json({ message: "Error fetching top users" });
    }
  });
  app2.get("/api/users/:id/reputation", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const reputation = await storage.getUserReputation(userId);
      res.json({ reputation });
    } catch (err) {
      res.status(500).json({ message: "Error fetching user reputation" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 3001;
  server.listen(port, 5e3, () => {
    log(`\u{1F680} Server running on port ${port}`);
  });
})();
