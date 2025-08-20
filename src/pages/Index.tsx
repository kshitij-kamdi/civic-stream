import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Users, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  Zap
} from 'lucide-react';
import { getAuthUser } from '@/lib/mockDb';

const Index = () => {
  const authUser = getAuthUser();

  const features = [
    {
      icon: FileText,
      title: "Easy Submission",
      description: "Submit grievances with detailed forms and file attachments",
      color: "bg-primary"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your grievance status with live updates and timelines",
      color: "bg-accent"
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Government-grade security with full transparency in process",
      color: "bg-success"
    },
    {
      icon: Zap,
      title: "Fast Resolution", 
      description: "SLA-based processing ensures timely resolution of issues",
      color: "bg-warning"
    }
  ];

  const stats = [
    { label: "Grievances Resolved", value: "10,000+", icon: CheckCircle },
    { label: "Active Citizens", value: "25,000+", icon: Users },
    { label: "Government Departments", value: "50+", icon: Shield },
    { label: "Average Response Time", value: "< 24hrs", icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur">
                <Scale className="h-16 w-16" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                E-Governance
                <span className="block text-3xl md:text-5xl text-white/90">
                  Grievance Redressal Portal
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Your voice matters. Submit, track, and resolve civic issues with transparency and efficiency.
              </p>
            </div>

            {!authUser ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="/register-citizen">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register as Citizen
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="/login-citizen">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Badge variant="outline" className="border-white text-white text-lg px-4 py-2">
                  Welcome back, {authUser.name}!
                </Badge>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href={authUser.role === 'citizen' ? '/raise' : authUser.role === 'official' ? '/official' : '/admin'}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process ensures your grievances are handled efficiently and transparently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center shadow-card hover:shadow-elevated transition-shadow">
                  <CardHeader>
                    <div className={`mx-auto p-3 rounded-full w-fit ${feature.color}`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Portal Statistics
            </h2>
            <p className="text-xl text-muted-foreground">
              Numbers that reflect our commitment to efficient governance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of citizens who are actively participating in improving their communities through our digital platform.
            </p>
            
            {!authUser ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="/register-citizen">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started Today
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="/login-official">
                    Official Login
                  </a>
                </Button>
              </div>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <a href="/raise">
                  <FileText className="mr-2 h-5 w-5" />
                  Submit New Grievance
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
