import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Edit, Shield, User as UserIcon, Lock, Unlock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editUserSchema = z.object({
  fullName: z.string().min(1, "Tên không được để trống"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["admin", "staff", "user"]),
});

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      role: "user",
    },
  });

  // Lấy danh sách người dùng từ API
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  // Cập nhật người dùng
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: z.infer<typeof editUserSchema> }) => {
      return await apiRequest({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: userData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin người dùng thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin người dùng",
        variant: "destructive",
      });
    },
  });

  // Thay đổi trạng thái người dùng
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest({
        url: `/api/users/${id}/status`,
        method: 'PUT',
        body: { isActive: !isActive },
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái người dùng thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái người dùng",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    editForm.reset({
      fullName: user.fullName,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
    });
  };

  const handleToggleStatus = (id: number, isActive: boolean) => {
    toggleUserStatusMutation.mutate({ id, isActive });
  };

  const onSubmitEdit = (data: z.infer<typeof editUserSchema>) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, userData: data });
    }
  };

  // Lọc người dùng
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'staff': return <UserIcon className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả vai trò</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy người dùng nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Tên đầy đủ</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Username</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Vai trò</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Trạng thái</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-200 px-4 py-2">{user.fullName}</td>
                        <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-200 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Badge variant="secondary" className={getRoleColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">
                              {user.role === 'admin' && 'Quản trị viên'}
                              {user.role === 'staff' && 'Nhân viên'}
                              {user.role === 'user' && 'Người dùng'}
                            </span>
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
                                </DialogHeader>
                                <Form {...editForm}>
                                  <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                                    <FormField
                                      control={editForm.control}
                                      name="fullName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Tên đầy đủ</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Nhập tên đầy đủ" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="phone"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Số điện thoại</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Nhập số điện thoại" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="address"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Địa chỉ</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Nhập địa chỉ" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={editForm.control}
                                      name="role"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Vai trò</FormLabel>
                                          <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Chọn vai trò" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="admin">Quản trị viên</SelectItem>
                                              <SelectItem value="staff">Nhân viên</SelectItem>
                                              <SelectItem value="user">Người dùng</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <Button type="submit" disabled={updateUserMutation.isPending}>
                                        {updateUserMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                                      </Button>
                                    </div>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                              onClick={() => handleToggleStatus(user.id, user.isActive)}
                              disabled={toggleUserStatusMutation.isPending}
                            >
                              {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}