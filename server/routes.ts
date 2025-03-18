import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertThreadSchema, insertPostSchema, 
  insertVoteSchema, insertSubscriptionSchema, insertFlagSchema 
} from "@shared/schema";
import { setupAuth } from "./auth";
import { highlightCode } from "./lib/codeHighlight";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API routes - prefix all routes with /api
  
  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
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
  
  // Threads
  app.get("/api/threads", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const threads = await storage.getThreads(limit, offset);
      
      // Get additional data for threads
      const threadsWithDetails = await Promise.all(threads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts = await storage.getPosts(thread.id);
        
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts.length
        };
      }));
      
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching threads" });
    }
  });
  
  // Popular threads (sorted by view count)
  app.get("/api/threads/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      // Get all threads first, then sort and slice (memory DB approach)
      const allThreads = await storage.getThreads();
      
      // Sort by viewCount in descending order
      const sortedThreads = [...allThreads].sort((a, b) => {
        const viewsA = a.viewCount || 0;
        const viewsB = b.viewCount || 0;
        return viewsB - viewsA;
      }).slice(offset, offset + limit);
      
      // Get additional data for threads
      const threadsWithDetails = await Promise.all(sortedThreads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts = await storage.getPosts(thread.id);
        
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts.length
        };
      }));
      
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching popular threads" });
    }
  });
  
  // Recent threads (sorted by creation date)
  app.get("/api/threads/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      // Get all threads first, then sort and slice (memory DB approach)
      const allThreads = await storage.getThreads();
      
      // Sort by createdAt in descending order (newest first)
      const sortedThreads = [...allThreads].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }).slice(offset, offset + limit);
      
      // Get additional data for threads
      const threadsWithDetails = await Promise.all(sortedThreads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        const posts = await storage.getPosts(thread.id);
        
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: category ? { id: category.id, name: category.name, color: category.color } : null,
          replyCount: posts.length
        };
      }));
      
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching recent threads" });
    }
  });
  
  app.get("/api/categories/:id/threads", async (req, res) => {
    try {
      const categoryId = Number(req.params.id);
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      const category = await storage.getCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const threads = await storage.getThreadsByCategory(categoryId, limit, offset);
      
      // Get additional data for threads
      const threadsWithDetails = await Promise.all(threads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const posts = await storage.getPosts(thread.id);
        
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          category: { id: category.id, name: category.name, color: category.color },
          replyCount: posts.length
        };
      }));
      
      res.json(threadsWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Error fetching threads" });
    }
  });
  
  app.get("/api/threads/:id", async (req, res) => {
    try {
      const threadId = Number(req.params.id);
      const thread = await storage.getThread(threadId);
      
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      // Increment view count
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
  
  app.post("/api/threads", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a thread" });
      }
      
      const data = insertThreadSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const thread = await storage.createThread(data);
      
      // Create initial post with the thread content
      if (req.body.content) {
        await storage.createPost({
          content: req.body.content,
          threadId: thread.id,
          userId: req.user.id
        });
      }
      
      // Auto-subscribe the creator to the thread
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
  
  app.put("/api/threads/:id", async (req, res) => {
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
  
  // Posts
  app.get("/api/threads/:id/posts", async (req, res) => {
    try {
      const threadId = Number(req.params.id);
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      const thread = await storage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      const posts = await storage.getPosts(threadId, limit, offset);
      
      // Get additional data for posts
      const postsWithDetails = await Promise.all(posts.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const votes = await storage.getVotes(post.id);
        const userVote = req.isAuthenticated() ? 
          await storage.getUserVote(req.user.id, post.id) : undefined;
        
        // Calculate vote score
        const score = votes.reduce((sum, vote) => sum + vote.value, 0);
        
        // Apply code highlighting to content
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
  
  app.post("/api/threads/:id/posts", async (req, res) => {
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
      
      // Check if need to create notification for thread owner
      if (thread.userId !== req.user.id) {
        await storage.createNotification({
          userId: thread.userId,
          type: 'thread_reply',
          content: `${req.user.name} replied to your thread "${thread.title}"`,
          relatedId: post.id
        });
      }
      
      // Check if need to create notification for parent post owner
      if (data.parentId) {
        const parentPost = await storage.getPost(data.parentId);
        if (parentPost && parentPost.userId !== req.user.id) {
          await storage.createNotification({
            userId: parentPost.userId,
            type: 'post_reply',
            content: `${req.user.name} replied to your post`,
            relatedId: post.id
          });
        }
      }
      
      // Notify subscribers
      const subscriptions = Array.from((await storage.getSubscriptions(thread.userId)).values())
        .filter(sub => 
          (sub.threadId === threadId || sub.categoryId === thread.categoryId) && 
          sub.userId !== req.user.id
        );
      
      for (const sub of subscriptions) {
        await storage.createNotification({
          userId: sub.userId,
          type: 'subscription',
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
  
  app.put("/api/posts/:id", async (req, res) => {
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
  
  app.delete("/api/posts/:id", async (req, res) => {
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
  
  // Votes
  app.post("/api/posts/:id/vote", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to vote" });
      }
      
      const postId = Number(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Don't allow voting on your own posts
      if (post.userId === req.user.id) {
        return res.status(403).json({ message: "You cannot vote on your own posts" });
      }
      
      const data = insertVoteSchema.parse({
        userId: req.user.id,
        postId,
        value: req.body.value === 1 ? 1 : -1
      });
      
      const vote = await storage.createOrUpdateVote(data);
      const votes = await storage.getVotes(postId);
      const score = votes.reduce((sum, v) => sum + v.value, 0);
      
      res.json({ vote, score });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating vote" });
    }
  });
  
  // Subscriptions
  app.get("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view subscriptions" });
      }
      
      const subscriptions = await storage.getSubscriptions(req.user.id);
      
      // Get additional data for subscriptions
      const subscriptionsWithDetails = await Promise.all(subscriptions.map(async (sub) => {
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
  
  app.post("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to subscribe" });
      }
      
      const data = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if already subscribed
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
  
  app.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to unsubscribe" });
      }
      
      const subscriptionId = Number(req.params.id);
      const subscription = await storage.getSubscription(subscriptionId);
      
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
  
  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view notifications" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      const notifications = await storage.getNotifications(req.user.id, limit, offset);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  
  app.get("/api/notifications/unread-count", async (req, res) => {
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
  
  app.put("/api/notifications/:id/read", async (req, res) => {
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
  
  app.put("/api/notifications/mark-all-read", async (req, res) => {
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
  
  // Flags for moderation
  app.post("/api/posts/:id/flag", async (req, res) => {
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
  
  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      
      // Search threads
      const threads = await storage.searchThreads(query, limit, offset);
      const threadsWithDetails = await Promise.all(threads.map(async (thread) => {
        const user = await storage.getUser(thread.userId);
        const category = await storage.getCategory(thread.categoryId);
        return {
          ...thread,
          user: user ? { id: user.id, name: user.name } : null,
          category: category ? { id: category.id, name: category.name } : null
        };
      }));
      
      // Search posts
      const posts = await storage.searchPosts(query, limit, offset);
      const postsWithDetails = await Promise.all(posts.map(async (post) => {
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
  
  // Profile
  app.get("/api/users/:id/profile", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password
      const { password, ...userProfile } = user;
      
      // Get user's threads
      const threads = await storage.getThreadsByUser(userId, 5);
      
      // Get user's posts
      const posts = await storage.getPostsByUser(userId, 5);
      
      res.json({
        ...userProfile,
        threads,
        posts
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });
  
  app.put("/api/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      
      const { password, email, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;
      
      res.json(userResponse);
    } catch (err) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  // Badge routes
  app.get("/api/badges", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const level = req.query.level ? Number(req.query.level) : undefined;
      
      const badges = await storage.getBadges(category, level);
      res.json(badges);
    } catch (err) {
      res.status(500).json({ message: "Error fetching badges" });
    }
  });
  
  app.get("/api/badges/:id", async (req, res) => {
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
  
  app.get("/api/users/:id/badges", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user badges" });
    }
  });
  
  app.put("/api/users/:userId/badges/:badgeId/display", async (req, res) => {
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
  
  // Reputation routes
  app.get("/api/users/top", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const topUsers = await storage.getTopUsers(limit);
      
      // Clean up sensitive data
      const cleanedUsers = topUsers.map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        reputation: user.reputation,
      }));
      
      res.json(cleanedUsers);
    } catch (err) {
      res.status(500).json({ message: "Error fetching top users" });
    }
  });
  
  app.get("/api/users/:id/reputation", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
