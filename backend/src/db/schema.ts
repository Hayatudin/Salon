import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

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
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

export type CustomDesign = typeof customDesigns.$inferSelect;
export type InsertCustomDesign = typeof customDesigns.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
