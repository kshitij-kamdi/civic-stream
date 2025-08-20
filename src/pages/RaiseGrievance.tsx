import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Upload,
  AlertCircle 
} from 'lucide-react';
import { getAuthUser, createGrievance } from '@/lib/mockDb';
import { GRIEVANCE_CATEGORIES } from '@/lib/types';

export default function RaiseGrievance() {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    address: '',
    pincode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [newGrievanceId, setNewGrievanceId] = useState('');
  const authUser = getAuthUser();
  const navigate = useNavigate();

  const selectedCategory = GRIEVANCE_CATEGORIES.find(cat => cat.value === formData.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    setIsLoading(true);

    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const categoryInfo = GRIEVANCE_CATEGORIES.find(cat => cat.value === formData.category);
      
      const newGrievance = createGrievance({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        address: formData.address,
        pincode: formData.pincode,
        citizenId: authUser.id,
        citizenName: authUser.name,
        citizenPhone: authUser.phone,
        status: 'submitted',
        priority: 'medium',
        slaHours: categoryInfo?.slaHours || 48,
        isEscalated: false
      });
      
      setNewGrievanceId(newGrievance.id);
      setShowAcknowledgment(true);
      
      toast({
        title: "Grievance Submitted",
        description: `Your grievance has been registered with ID: ${newGrievance.id}`
      });
      
      // Reset form
      setFormData({
        category: '',
        title: '',
        description: '',
        address: '',
        pincode: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['citizen']}>
      <div className="min-h-screen bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Raise a Grievance</h1>
              <p className="text-muted-foreground mt-2">
                Submit your complaint and we'll ensure it reaches the right department
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-government">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Grievance Details</span>
                    </CardTitle>
                    <CardDescription>
                      Please provide detailed information about your issue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRIEVANCE_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{category.label}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {category.slaHours}h SLA
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedCategory && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Expected resolution within {selectedCategory.slaHours} hours</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of the issue"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide detailed information about the issue, including any relevant circumstances, time of occurrence, and impact on you or the community."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="address"
                              placeholder="Complete address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="rounded-l-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input
                            id="pincode"
                            placeholder="6-digit PIN code"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Attachments (Optional)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4">
                              <Button type="button" variant="outline" size="sm">
                                Choose Files
                              </Button>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Upload photos or documents related to your grievance
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Max 5MB per file. Supported formats: JPG, PNG, PDF
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Grievance'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How it Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-primary rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Submit</p>
                        <p className="text-xs text-muted-foreground">Fill out the form with your grievance details</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-accent rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Assign</p>
                        <p className="text-xs text-muted-foreground">Your case is assigned to the relevant department</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-success rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Track</p>
                        <p className="text-xs text-muted-foreground">Monitor progress and receive updates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Important</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>• Provide accurate and complete information</p>
                    <p>• Include specific location details</p>
                    <p>• Attach relevant photos or documents</p>
                    <p>• You will receive an acknowledgment with tracking ID</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Acknowledgment Dialog */}
      <Dialog open={showAcknowledgment} onOpenChange={setShowAcknowledgment}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 p-3 bg-success/10 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center">Grievance Submitted Successfully</DialogTitle>
            <DialogDescription className="text-center">
              Your grievance has been registered and will be processed by the relevant department
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Your Grievance ID:</p>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <p className="font-mono text-lg font-bold">{newGrievanceId}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save this ID to track your grievance status
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/track')}
                className="flex-1"
              >
                Track Status
              </Button>
              <Button 
                onClick={() => setShowAcknowledgment(false)}
                className="flex-1"
              >
                Submit Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}