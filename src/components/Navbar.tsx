import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Scale, 
  UserCheck, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { getAuthUser, clearAuth } from '@/lib/mockDb';
import { UserRole } from '@/lib/types';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authUser = getAuthUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'citizen': return { label: 'Citizen', icon: User, variant: 'secondary' as const };
      case 'official': return { label: 'Official', icon: UserCheck, variant: 'default' as const };
      case 'admin': return { label: 'Admin', icon: Shield, variant: 'destructive' as const };
    }
  };

  const getNavLinks = () => {
    if (!authUser) return [];
    
    switch (authUser.role) {
      case 'citizen':
        return [
          { path: '/raise', label: 'Raise Grievance' },
          { path: '/track', label: 'Track Grievances' }
        ];
      case 'official':
        return [
          { path: '/official', label: 'Dashboard' }
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Admin Panel' }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const roleDisplay = authUser ? getRoleDisplay(authUser.role) : null;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">E-Governance</h1>
                <p className="text-xs text-muted-foreground">Grievance Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {authUser ? (
              <>
                {roleDisplay && (
                  <Badge variant={roleDisplay.variant} className="hidden sm:flex items-center space-x-1">
                    <roleDisplay.icon className="h-3 w-3" />
                    <span>{roleDisplay.label}</span>
                  </Badge>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {authUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{authUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {authUser.email}
                        </p>
                        {authUser.department && (
                          <p className="text-xs leading-none text-muted-foreground">
                            Dept: {authUser.department}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login-citizen">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register-citizen">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {roleDisplay && (
                <div className="px-3 py-2">
                  <Badge variant={roleDisplay.variant} className="flex items-center space-x-1 w-fit">
                    <roleDisplay.icon className="h-3 w-3" />
                    <span>{roleDisplay.label}</span>
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}