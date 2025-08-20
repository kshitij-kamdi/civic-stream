import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UserCheck, Phone, ArrowLeft, Shield } from 'lucide-react';
import { getUserByCredentials, setAuthUser } from '@/lib/mockDb';

export default function LoginOfficial() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    adminCredentials: { email: '', password: '' }
  });
  const [loginType, setLoginType] = useState<'official' | 'admin'>('official');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (loginType === 'admin') {
        // Mock admin login
        if (formData.adminCredentials.email === 'admin' && formData.adminCredentials.password === 'admin123') {
          const adminUser = {
            id: 'admin_001',
            name: 'Admin User',
            email: 'admin@gov.in',
            phone: '+91-9876543213',
            role: 'admin' as const
          };
          
          setAuthUser(adminUser);
          
          toast({
            title: "Admin Login Successful",
            description: `Welcome, ${adminUser.name}!`
          });
          
          navigate('/admin');
        } else {
          toast({
            title: "Admin Login Failed",
            description: "Invalid admin credentials.",
            variant: "destructive"
          });
        }
      } else {
        const user = getUserByCredentials(formData.email, formData.phone);
        
        if (user && user.role === 'official') {
          setAuthUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            department: user.department
          });
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}!`
          });
          
          navigate('/official');
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid credentials or account not found.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-government">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-primary rounded-full w-fit">
              {loginType === 'admin' ? (
                <Shield className="h-6 w-6 text-primary-foreground" />
              ) : (
                <UserCheck className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                {loginType === 'admin' ? 'Admin Login' : 'Official Login'}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">
                {loginType === 'admin' 
                  ? 'Access administrative functions'
                  : 'Enter your official credentials to access the dashboard'
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex space-x-2">
                <Button
                  variant={loginType === 'official' ? 'default' : 'outline'}
                  onClick={() => setLoginType('official')}
                  className="flex-1"
                >
                  Official
                </Button>
                <Button
                  variant={loginType === 'admin' ? 'default' : 'outline'}
                  onClick={() => setLoginType('admin')}
                  className="flex-1"
                >
                  Admin
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === 'admin' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Username</Label>
                    <Input
                      id="admin-email"
                      type="text"
                      placeholder="admin"
                      value={formData.adminCredentials.email}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        adminCredentials: { 
                          ...formData.adminCredentials, 
                          email: e.target.value 
                        }
                      })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="admin123"
                      value={formData.adminCredentials.password}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        adminCredentials: { 
                          ...formData.adminCredentials, 
                          password: e.target.value 
                        }
                      })}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="official@gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91-9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Official'}`}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Need an official account?{' '}
                <Button variant="link" className="p-0" asChild>
                  <a href="/register-official">Register here</a>
                </Button>
              </div>
              
              <div className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/login-citizen">Login as Citizen</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}