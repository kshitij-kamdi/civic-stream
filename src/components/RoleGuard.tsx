import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { getAuthUser } from '@/lib/mockDb';
import { UserRole } from '@/lib/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  redirectTo?: string;
  showUnauthorized?: boolean;
}

export function RoleGuard({ 
  allowedRoles, 
  children, 
  redirectTo,
  showUnauthorized = true 
}: RoleGuardProps) {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  useEffect(() => {
    if (!authUser && redirectTo) {
      navigate(redirectTo);
      return;
    }
  }, [authUser, redirectTo, navigate]);

  // Not authenticated
  if (!authUser) {
    if (redirectTo) return null; // Will redirect via useEffect
    
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to log in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <a href="/login-citizen">Login as Citizen</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/login-official">Login as Official</a>
              </Button>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role authorization
  const hasRequiredRole = allowedRoles.includes(authUser.role);

  if (!hasRequiredRole) {
    if (!showUnauthorized) {
      navigate('/');
      return null;
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-warning/10 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Your current role is {authUser.role}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Required roles: {allowedRoles.join(', ')}
            </div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}