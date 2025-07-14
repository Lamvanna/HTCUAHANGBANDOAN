import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, UserCheck, UserX, Edit, Shield, User as UserIcon } from "lucide-react";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration - in real app this would be a proper API call
  const users: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@nafood.com",
      password: "hashed",
      fullName: "Quản trị viên",
      phone: "0123456789",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      username: "staff1",
      email: "staff@nafood.com",
      password: "hashed",
      fullName: "Nhân viên 1",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      role: "staff",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      username: "user1",
      email: "user1@gmail.com",
      password: "hashed",
      fullName: "Nguyễn Văn A",
      phone: "0111222333",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      role: "user",
      isActive: true,
      createdAt: new Date(),
    },
  ];

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('PUT', `/api/users/${id}/role`, { role });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Cập nhật vai trò thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    updateUserRoleMutation.mutate({ id: userId, role: newRole });
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      staff: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleText = (role: string) => {
    const roleText = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      user: 'Người dùng',
    };
    return roleText[role as keyof typeof roleText] || role;
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: Shield,
      staff: UserCheck,
      user: UserIcon,
    };
    const Icon = icons[role as keyof typeof icons] || UserIcon;
    return <Icon className="h-4 w-4" />;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const roleOptions = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'staff', label: 'Nhân viên' },
    { value: 'user', label: 'Người dùng' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
        <p className="text-gray-600 mt-1">Xem và quản lý tất cả người dùng trong hệ thống</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả vai trò</SelectItem>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(''); 
                setRoleFilter(''); 
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Thông tin</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Liên hệ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vai trò</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4 font-medium">#{user.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-600">@{user.username}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-gray-600">{user.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                {getRoleIcon(option.value)}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'staff').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quản trị viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
