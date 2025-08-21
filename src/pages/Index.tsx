import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Zap,
  Globe,
  BookOpen,
  ChevronDown,
  Search,
  Phone,
  MessageCircle
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

            {authUser && (
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

      {/* Grievance Submission Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Have a Grievance or Complaint?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your concerns matter to us. Submit your grievances and complaints through our secure platform for prompt resolution by the appropriate authorities.
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur rounded-2xl p-8 border shadow-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Submit Complaint</h3>
                  <p className="text-sm text-muted-foreground">Describe your issue in detail with supporting documents</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-accent/20 rounded-full w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">Monitor your complaint status in real-time</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-success/20 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-success-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Get Resolution</h3>
                  <p className="text-sm text-muted-foreground">Receive timely resolution from officials</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {authUser ? (
                  <Button size="lg" asChild>
                    <a href="/raise">
                      <FileText className="mr-2 h-5 w-5" />
                      Submit Your Grievance
                    </a>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <a href="/register-citizen">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Register to Submit
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/login-citizen">
                        <LogIn className="mr-2 h-5 w-5" />
                        Login to Submit
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Language Selection Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Choose Your Preferred Language
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Access the portal in your preferred language for a better experience.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-gradient-card p-6 rounded-2xl border shadow-card">
                <div className="flex items-center gap-4">
                  <Globe className="h-8 w-8 text-primary" />
                  <Select defaultValue="english">
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Manual Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              User Manual & Help Guide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how to effectively use the portal to file complaints and track your grievances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* How to File a Complaint */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">How to File a Complaint</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-1">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Register/Login</h4>
                      <p className="text-sm text-muted-foreground">Create an account or login to access the complaint portal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-1">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Choose Department</h4>
                      <p className="text-sm text-muted-foreground">Select the relevant government department for your issue</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-1">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Fill Details</h4>
                      <p className="text-sm text-muted-foreground">Provide comprehensive details about your complaint</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-1">4</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Upload Documents</h4>
                      <p className="text-sm text-muted-foreground">Attach supporting documents, photos, or evidence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-1">5</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Submit & Track</h4>
                      <p className="text-sm text-muted-foreground">Submit your complaint and receive a tracking ID</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-accent/20 rounded-full">
                      <BookOpen className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Help & Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <Search className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">Track Status</h4>
                        <p className="text-sm text-muted-foreground">Use your complaint ID to check progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">Response Times</h4>
                        <p className="text-sm text-muted-foreground">Most complaints are addressed within 7-15 days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">Helpline</h4>
                        <p className="text-sm text-muted-foreground">Call 1800-XXX-XXXX for urgent assistance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">Live Chat</h4>
                        <p className="text-sm text-muted-foreground">Available Mon-Fri, 9 AM - 6 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Download Full User Manual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                <Button size="lg" variant="secondary" asChild>
                  <a href="/login-official">
                    <LogIn className="mr-2 h-5 w-5" />
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
