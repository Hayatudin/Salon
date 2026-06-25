import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: text("created_at"),
});

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  artist: text("artist").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  notes: text("notes"),
  customDesignId: text("custom_design_id"),
  createdAt: text("created_at"),
});

export const customDesigns = sqliteTable("custom_designs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shape: text("shape").notNull(),
  color: text("color").notNull(),
  texture: text("texture").notNull(),
  decor: text("decor").notNull(),
  createdAt: text("created_at"),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  rating: real("rating").notNull(),
  text: text("text").notNull(),
  service: text("service").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at"),
});

export type UserRecord = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

export type CustomDesign = typeof customDesigns.$inferSelect;
export type InsertCustomDesign = typeof customDesigns.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  createdAt: text("created_at"),
});

export const designs = sqliteTable("designs", {
  id: text("id").primaryKey(),
  nameKey: text("name_key"),
  defaultName: text("default_name").notNull(),
  price: real("price").notNull(),
  duration: real("duration").notNull().default(60),
  shape: text("shape"),
  type: text("type"),
  rating: real("rating").default(5.0),
  reviewsCount: real("reviews_count").default(1),
  colors: text("colors"),
  image: text("image").notNull(),
  tags: text("tags"),
  collectionId: text("collection_id"),
  createdAt: text("created_at"),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

export type Design = typeof designs.$inferSelect;
export type InsertDesign = typeof designs.$inferInsert;


