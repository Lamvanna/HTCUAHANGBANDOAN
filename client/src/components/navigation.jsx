import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth.jsx";
import { useCart } from "@/lib/cart.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, LogOut, Settings, Package, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/logo";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleHomeClick = () => {
    setLocation("/");
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Height of sticky header
      const elementPosition = element.offsetTop - headerHeight;

      // Add a small delay for better UX
      setTimeout(() => {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleMenuClick = (e) => {
    e?.preventDefault();
    smoothScrollTo('menu');
  };

  const handleAboutClick = (e) => {
    e?.preventDefault();
    smoothScrollTo('about');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div onClick={handleHomeClick}>
              <Logo size="md" showText={true} className="cursor-pointer hover:scale-105 transition-transform duration-200" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 ml-12">
            <span
              onClick={handleHomeClick}
              className={`font-medium transition-colors cursor-pointer ${
                location === "/" ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              Trang chủ
            </span>
            <span
              onClick={handleMenuClick}
              className="font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              Thực đơn
            </span>
            <span
              onClick={handleAboutClick}
              className="font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              Về chúng tôi
            </span>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>



            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => {
                // Cart modal will be handled by the CartModal component
                const event = new CustomEvent('openCart');
                window.dispatchEvent(event);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs text-white" style={{backgroundColor: '#AA1515'}}>
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => setLocation("/admin")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Quản trị
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'staff' && (
                    <DropdownMenuItem onClick={() => setLocation("/staff")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Nhân viên
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setLocation("/auth")}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <div
                  className={`block px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                    location === "/" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    handleHomeClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Trang chủ
                </div>
                <div
                  className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    handleMenuClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Thực đơn
                </div>
                <div
                  className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    handleAboutClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Về chúng tôi
                </div>
              </div>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="border-t pt-4 space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Xin chào, {user?.fullName}
                  </div>
                  <Link href="/orders">
                    <div className="flex items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      <Package className="mr-2 h-4 w-4" />
                      Đơn hàng của tôi
                    </div>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <div className="flex items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Quản trị
                      </div>
                    </Link>
                  )}
                  {user?.role === 'staff' && (
                    <Link href="/staff">
                      <div className="flex items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Nhân viên
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setLocation("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
