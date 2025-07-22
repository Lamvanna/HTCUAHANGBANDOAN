import { z } from "zod";

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
  total: z.union([z.string(), z.number()]).transform(val => {
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) throw new Error('Invalid total format');
      return parsed;
    }
    return val;
  }),
  status: z.enum(["pending", "processing", "shipping", "delivered", "cancelled"]).default("pending"),
  paymentMethod: z.enum(["cod", "bank_transfer", "e_wallet"]),
  customerName: z.string().min(1, "Tên khách hàng là bắt buộc"),
  customerPhone: z.string().min(1, "Số điện thoại là bắt buộc"),
  customerAddress: z.string().min(1, "Địa chỉ là bắt buộc"),
  items: z.array(z.object({
    productId: z.number(),
    name: z.string(),
    price: z.union([z.string(), z.number()]).transform(val => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error('Invalid price format');
        return parsed;
      }
      return val;
    }),
    quantity: z.number().positive(),
    image: z.string().optional(),
  })),
  notes: z.string().optional().nullable().transform(val => val || ""),
});

export const insertReviewSchema = z.object({
  userId: z.number(),
  productId: z.union([z.string(), z.number()]).transform(val => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) throw new Error('Invalid productId format');
    return parsed;
  }),
  orderId: z.union([z.string(), z.number()]).transform(val => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) throw new Error('Invalid orderId format');
    return parsed;
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Bình luận là bắt buộc"),
});

export const insertBannerSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().optional(),
  image: z.string().min(1, "Hình ảnh là bắt buộc"),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(1, "Tên đầy đủ là bắt buộc"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});
