import { 
  users, categories, threads, posts, votes, subscriptions, 
  notifications, flags, badges, userBadges,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Thread, type InsertThread, type Post, type InsertPost, 
  type Vote, type InsertVote, type Subscription, type InsertSubscription, 
  type Notification, type InsertNotification, type Flag, type InsertFlag,
  type Badge, type InsertBadge, type UserBadge, type InsertUserBadge
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Thread operations
  getThreads(limit?: number, offset?: number): Promise<Thread[]>;
  getThreadsByCategory(categoryId: number, limit?: number, offset?: number): Promise<Thread[]>;
  getThreadsByUser(userId: number, limit?: number, offset?: number): Promise<Thread[]>;
  getThread(id: number): Promise<Thread | undefined>;
  createThread(thread: InsertThread): Promise<Thread>;
  updateThread(id: number, data: Partial<InsertThread>): Promise<Thread | undefined>;
  incrementThreadViewCount(id: number): Promise<void>;
  
  // Post operations
  getPosts(threadId: number, limit?: number, offset?: number): Promise<Post[]>;
  getPostsByUser(userId: number, limit?: number, offset?: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined>;
  
  // Vote operations
  getVotes(postId: number): Promise<Vote[]>;
  getUserVote(userId: number, postId: number): Promise<Vote | undefined>;
  createOrUpdateVote(vote: InsertVote): Promise<Vote>;
  
  // Subscription operations
  getSubscriptions(userId: number): Promise<Subscription[]>;
  getSubscription(userId: number, threadId?: number, categoryId?: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<boolean>;
  
  // Notification operations
  getNotifications(userId: number, limit?: number, offset?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  
  // Flag operations
  getFlags(limit?: number, offset?: number): Promise<Flag[]>;
  createFlag(flag: InsertFlag): Promise<Flag>;
  updateFlagStatus(id: number, status: string): Promise<Flag | undefined>;
  
  // Badge operations
  getBadges(category?: string, level?: number): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  getBadgeByName(name: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  updateBadge(id: number, data: Partial<InsertBadge>): Promise<Badge | undefined>;
  
  // User Badge operations
  getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  getUserBadge(userId: number, badgeId: number): Promise<UserBadge | undefined>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  updateUserBadgeDisplay(userId: number, badgeId: number, display: boolean): Promise<UserBadge | undefined>;
  
  // Reputation operations
  getUserReputation(userId: number): Promise<number>;
  updateUserReputation(userId: number, points: number): Promise<number>;
  getTopUsers(limit?: number): Promise<User[]>;
  checkAndAwardBadges(userId: number): Promise<Badge[]>;
  
  // Search operations
  searchThreads(query: string, limit?: number, offset?: number): Promise<Thread[]>;
  searchPosts(query: string, limit?: number, offset?: number): Promise<Post[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private threads: Map<number, Thread>;
  private posts: Map<number, Post>;
  private votes: Map<string, Vote>;
  private subscriptions: Map<number, Subscription>;
  private notifications: Map<number, Notification>;
  private flags: Map<number, Flag>;
  private badges: Map<number, Badge>;
  private userBadges: Map<string, UserBadge>;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private threadId: number = 1;
  private postId: number = 1;
  private subscriptionId: number = 1;
  private notificationId: number = 1;
  private flagId: number = 1;
  private badgeId: number = 1;
  
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.threads = new Map();
    this.posts = new Map();
    this.votes = new Map();
    this.subscriptions = new Map();
    this.notifications = new Map();
    this.flags = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some categories
    this.seedCategories();
    
    // Initialize with some badges
    this.seedBadges();
  }
  
  // Seed basic badges
  private async seedBadges() {
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
  private async seedCategories() {
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
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    const newUser: User = {
      ...user,
      id,
      reputation: 0,
      createdAt: timestamp
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...data,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const timestamp = new Date();
    const newCategory: Category = {
      ...category,
      id,
      createdAt: timestamp
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Thread operations
  async getThreads(limit: number = 20, offset: number = 0): Promise<Thread[]> {
    const threads = Array.from(this.threads.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return threads.slice(offset, offset + limit);
  }
  
  async getThreadsByCategory(categoryId: number, limit: number = 20, offset: number = 0): Promise<Thread[]> {
    const threads = Array.from(this.threads.values())
      .filter(thread => thread.categoryId === categoryId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return threads.slice(offset, offset + limit);
  }
  
  async getThreadsByUser(userId: number, limit: number = 20, offset: number = 0): Promise<Thread[]> {
    const threads = Array.from(this.threads.values())
      .filter(thread => thread.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return threads.slice(offset, offset + limit);
  }
  
  async getThread(id: number): Promise<Thread | undefined> {
    return this.threads.get(id);
  }
  
  async createThread(thread: InsertThread): Promise<Thread> {
    const id = this.threadId++;
    const timestamp = new Date();
    const newThread: Thread = {
      ...thread,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      viewCount: 0,
      isPinned: false,
      isClosed: false
    };
    this.threads.set(id, newThread);
    return newThread;
  }
  
  async updateThread(id: number, data: Partial<InsertThread>): Promise<Thread | undefined> {
    const thread = this.threads.get(id);
    if (!thread) return undefined;
    
    const updatedThread: Thread = {
      ...thread,
      ...data,
      updatedAt: new Date()
    };
    this.threads.set(id, updatedThread);
    return updatedThread;
  }
  
  async incrementThreadViewCount(id: number): Promise<void> {
    const thread = this.threads.get(id);
    if (thread) {
      thread.viewCount += 1;
      this.threads.set(id, thread);
    }
  }
  
  // Post operations
  async getPosts(threadId: number, limit: number = 100, offset: number = 0): Promise<Post[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.threadId === threadId && !post.isDeleted)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return posts.slice(offset, offset + limit);
  }
  
  async getPostsByUser(userId: number, limit: number = 20, offset: number = 0): Promise<Post[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.userId === userId && !post.isDeleted)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return posts.slice(offset, offset + limit);
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    return post && !post.isDeleted ? post : undefined;
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const id = this.postId++;
    const timestamp = new Date();
    const newPost: Post = {
      ...post,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      isDeleted: false
    };
    this.posts.set(id, newPost);
    
    // Update thread's updatedAt timestamp
    const thread = this.threads.get(post.threadId);
    if (thread) {
      thread.updatedAt = timestamp;
      this.threads.set(thread.id, thread);
    }
    
    return newPost;
  }
  
  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post || post.isDeleted) return undefined;
    
    const updatedPost: Post = {
      ...post,
      ...data,
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Vote operations
  async getVotes(postId: number): Promise<Vote[]> {
    return Array.from(this.votes.values())
      .filter(vote => vote.postId === postId);
  }
  
  async getUserVote(userId: number, postId: number): Promise<Vote | undefined> {
    const key = `${userId}-${postId}`;
    return this.votes.get(key);
  }
  
  async createOrUpdateVote(vote: InsertVote): Promise<Vote> {
    const key = `${vote.userId}-${vote.postId}`;
    const timestamp = new Date();
    const newVote: Vote = {
      ...vote,
      createdAt: timestamp
    };
    this.votes.set(key, newVote);
    
    // Update user reputation for the post owner
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
  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId);
  }
  
  async getSubscription(userId: number, threadId?: number, categoryId?: number): Promise<Subscription | undefined> {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId) {
        if (threadId && sub.threadId === threadId) return sub;
        if (categoryId && sub.categoryId === categoryId) return sub;
      }
    }
    return undefined;
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const timestamp = new Date();
    const newSubscription: Subscription = {
      ...subscription,
      id,
      createdAt: timestamp
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription: Subscription = {
      ...subscription,
      ...data
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async deleteSubscription(id: number): Promise<boolean> {
    return this.subscriptions.delete(id);
  }
  
  // Notification operations
  async getNotifications(userId: number, limit: number = 20, offset: number = 0): Promise<Notification[]> {
    const notifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return notifications.slice(offset, offset + limit);
  }
  
  async getUnreadNotificationCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead)
      .length;
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const timestamp = new Date();
    const newNotification: Notification = {
      ...notification,
      id,
      isRead: false,
      createdAt: timestamp
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId) {
        notification.isRead = true;
        this.notifications.set(id, notification);
      }
    }
  }
  
  // Flag operations
  async getFlags(limit: number = 20, offset: number = 0): Promise<Flag[]> {
    const flags = Array.from(this.flags.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return flags.slice(offset, offset + limit);
  }
  
  async createFlag(flag: InsertFlag): Promise<Flag> {
    const id = this.flagId++;
    const timestamp = new Date();
    const newFlag: Flag = {
      ...flag,
      id,
      status: "pending",
      createdAt: timestamp
    };
    this.flags.set(id, newFlag);
    return newFlag;
  }
  
  async updateFlagStatus(id: number, status: string): Promise<Flag | undefined> {
    const flag = this.flags.get(id);
    if (!flag) return undefined;
    
    flag.status = status;
    this.flags.set(id, flag);
    return flag;
  }
  
  // Badge operations
  async getBadges(category?: string, level?: number): Promise<Badge[]> {
    let badges = Array.from(this.badges.values());
    
    if (category) {
      badges = badges.filter(badge => badge.category === category);
    }
    
    if (level) {
      badges = badges.filter(badge => badge.level === level);
    }
    
    return badges.sort((a, b) => a.level - b.level);
  }
  
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async getBadgeByName(name: string): Promise<Badge | undefined> {
    for (const badge of this.badges.values()) {
      if (badge.name.toLowerCase() === name.toLowerCase()) {
        return badge;
      }
    }
    return undefined;
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.badgeId++;
    const timestamp = new Date();
    const newBadge: Badge = {
      ...badge,
      id,
      createdAt: timestamp
    };
    this.badges.set(id, newBadge);
    return newBadge;
  }
  
  async updateBadge(id: number, data: Partial<InsertBadge>): Promise<Badge | undefined> {
    const badge = this.badges.get(id);
    if (!badge) return undefined;
    
    const updatedBadge: Badge = {
      ...badge,
      ...data
    };
    this.badges.set(id, updatedBadge);
    return updatedBadge;
  }
  
  // User Badge operations
  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadges: (UserBadge & { badge: Badge })[] = [];
    
    for (const userBadge of this.userBadges.values()) {
      if (userBadge.userId === userId) {
        const badge = this.badges.get(userBadge.badgeId);
        if (badge) {
          userBadges.push({
            ...userBadge,
            badge
          });
        }
      }
    }
    
    return userBadges.sort((a, b) => {
      // Display badges first, then sort by level and award date
      if (a.displayOnProfile && !b.displayOnProfile) return -1;
      if (!a.displayOnProfile && b.displayOnProfile) return 1;
      if (a.badge.level !== b.badge.level) return b.badge.level - a.badge.level;
      return (b.earnedAt?.getTime() || 0) - (a.earnedAt?.getTime() || 0);
    });
  }
  
  async getUserBadge(userId: number, badgeId: number): Promise<UserBadge | undefined> {
    const key = `${userId}-${badgeId}`;
    return this.userBadges.get(key);
  }
  
  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const key = `${userBadge.userId}-${userBadge.badgeId}`;
    const timestamp = new Date();
    
    // Check if badge already awarded
    const existingBadge = this.userBadges.get(key);
    if (existingBadge) {
      return existingBadge;
    }
    
    // Create a user badge with a unique ID
    const id = Math.floor(Math.random() * 1000000); // Simple method for demo
    const newUserBadge: UserBadge = {
      id,
      ...userBadge,
      earnedAt: timestamp,
      displayOnProfile: true // By default, display the badge
    };
    
    this.userBadges.set(key, newUserBadge);
    
    // Create notification
    const badge = this.badges.get(userBadge.badgeId);
    if (badge) {
      await this.createNotification({
        type: 'badge',
        userId: userBadge.userId,
        content: `Congratulations! You've earned the "${badge.name}" badge: ${badge.description}`
      });
      
      // Add reputation points for earning the badge
      const user = this.users.get(userBadge.userId);
      if (user) {
        user.reputation = (user.reputation || 0) + badge.reputationPoints;
        this.users.set(user.id, user);
      }
    }
    
    return newUserBadge;
  }
  
  async updateUserBadgeDisplay(userId: number, badgeId: number, display: boolean): Promise<UserBadge | undefined> {
    const key = `${userId}-${badgeId}`;
    const userBadge = this.userBadges.get(key);
    
    if (!userBadge) return undefined;
    
    userBadge.displayOnProfile = display;
    this.userBadges.set(key, userBadge);
    
    return userBadge;
  }
  
  // Reputation operations
  async getUserReputation(userId: number): Promise<number> {
    const user = this.users.get(userId);
    return user?.reputation || 0;
  }
  
  async updateUserReputation(userId: number, points: number): Promise<number> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    user.reputation = (user.reputation || 0) + points;
    this.users.set(userId, user);
    
    // Check if the user has earned any badges based on reputation
    await this.checkAndAwardBadges(userId);
    
    return user.reputation;
  }
  
  async getTopUsers(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
      .slice(0, limit);
  }
  
  async checkAndAwardBadges(userId: number): Promise<Badge[]> {
    const user = this.users.get(userId);
    if (!user) return [];
    
    const badgesAwarded: Badge[] = [];
    
    // Check for reputation-based badges
    if (user.reputation >= 10) {
      // First level badge - Helping Hand
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
      // Third level badge - Problem Solver
      const problemSolverBadge = await this.getBadgeByName("Problem Solver");
      if (problemSolverBadge) {
        const existing = await this.getUserBadge(userId, problemSolverBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: problemSolverBadge.id });
          badgesAwarded.push(problemSolverBadge);
        }
      }
    }
    
    // Check for post count-based badges
    const userPosts = await this.getPostsByUser(userId);
    
    if (userPosts.length >= 1) {
      // First post badge
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
      // Active member badge
      const activeMemberBadge = await this.getBadgeByName("Active Member");
      if (activeMemberBadge) {
        const existing = await this.getUserBadge(userId, activeMemberBadge.id);
        if (!existing) {
          await this.awardBadge({ userId, badgeId: activeMemberBadge.id });
          badgesAwarded.push(activeMemberBadge);
        }
      }
    }
    
    // Check for thread-based badges
    const userThreads = await this.getThreadsByUser(userId);
    
    if (userThreads.length >= 1) {
      // First thread badge
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
  async searchThreads(query: string, limit: number = 20, offset: number = 0): Promise<Thread[]> {
    const lowercaseQuery = query.toLowerCase();
    const threads = Array.from(this.threads.values())
      .filter(thread => thread.title.toLowerCase().includes(lowercaseQuery))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return threads.slice(offset, offset + limit);
  }
  
  async searchPosts(query: string, limit: number = 20, offset: number = 0): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    const posts = Array.from(this.posts.values())
      .filter(post => !post.isDeleted && post.content.toLowerCase().includes(lowercaseQuery))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return posts.slice(offset, offset + limit);
  }
}

// Export a singleton instance
export const storage = new MemStorage();
