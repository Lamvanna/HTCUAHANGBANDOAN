import { z } from "zod";

// MongoDB Document Types
export interface User {
  _id?: string;
  id?: number; // For compatibility with frontend
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: "user" | "staff" | "admin";
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  _id?: string;
  id?: number; // For compatibility with frontend
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Order {
  _id?: string;
  id?: number; // For compatibility with frontend
  userId: number;
  total: number;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  paymentMethod: "cod" | "bank_transfer" | "e_wallet";
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Review {
  _id?: string;
  id?: number; // For compatibility with frontend
  userId: number;
  productId: number;
  orderId: number;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface Banner {
  _id?: string;
  id?: number; // For compatibility with frontend
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

// Zod Schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(1, "Tên đầy đủ là bắt buộc"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["user", "staff", "admin"]).default("user"),
  isActive: z.boolean().default(true),
});

export const insertProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]).transform(val => {
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) throw new Error('Invalid price format');
      return parsed;
    }
    return val;
  }),
  image: z.string().optional(),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  isActive: z.boolean().default(true),
});

export const insertOrderSchema = z.object({
  userId: z.number(),
  total: z.number().positive("Tổng tiền phải lớn hơn 0"),
  status: z.enum(["pending", "processing", "shipping", "delivered", "cancelled"]).default("pending"),
  paymentMethod: z.enum(["cod", "bank_transfer", "e_wallet"]),
  customerName: z.string().min(1, "Tên khách hàng là bắt buộc"),
  customerPhone: z.string().min(1, "Số điện thoại là bắt buộc"),
  customerAddress: z.string().min(1, "Địa chỉ là bắt buộc"),
  items: z.array(z.object({
    productId: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().positive(),
    image: z.string().optional(),
  })),
  notes: z.string().optional(),
});

export const insertReviewSchema = z.object({
  userId: z.number(),
  productId: z.number(),
  orderId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isApproved: z.boolean().default(false),
});

export const insertBannerSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().optional(),
  image: z.string().min(1, "Hình ảnh là bắt buộc"),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;