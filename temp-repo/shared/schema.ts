import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define users table (keeping the original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define tool categories
export const toolCategories = [
  'All Tools',
  'Formatters',
  'Encoders/Decoders',
  'Converters',
  'Generators',
  'Text Utilities',
  'Image Tools',
  'Network',
  'Crypto',
  'Data Tools',
  'Web Development',
  'System Tools',
  'Math Tools',
  'Development',
  'Design Tools',
  'Coming Soon'
] as const;

export type ToolCategory = typeof toolCategories[number];

// Define a tool schema
export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(toolCategories),
  path: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type Tool = z.infer<typeof toolSchema>;
