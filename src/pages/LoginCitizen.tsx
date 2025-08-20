import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Phone, ArrowLeft } from 'lucide-react';
import { getUserByCredentials, setAuthUser } from '@/lib/mockDb';

export default function LoginCitizen() {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate OTP verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user = getUserByCredentials(formData.email, formData.phone);
      
      if (user && user.role === 'citizen') {
        setAuthUser({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        });
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`
        });
        
        navigate('/raise');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or account not found.",
          variant: "destructive"
        });
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
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Citizen Login</CardTitle>
              <CardDescription>
                Enter your registered email or phone number to access the portal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Login with OTP'}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0" asChild>
                  <a href="/register-citizen">Register here</a>
                </Button>
              </div>
              
              <div className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/login-official">Login as Official</a>
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