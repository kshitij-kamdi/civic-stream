import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Calendar
} from 'lucide-react';
import { getAuthUser, getGrievancesByCitizen, getGrievanceById } from '@/lib/mockDb';
import { Grievance, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types';
import { getTimeLeftForSLA } from '@/lib/sla';

export default function TrackGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [searchId, setSearchId] = useState('');
  const [searchedGrievance, setSearchedGrievance] = useState<Grievance | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const authUser = getAuthUser();

  useEffect(() => {
    if (authUser) {
      const userGrievances = getGrievancesByCitizen(authUser.id);
      setGrievances(userGrievances);
    }
  }, [authUser]);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const grievance = getGrievanceById(searchId.trim());
    setSearchedGrievance(grievance);
    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'acknowledged': return <Eye className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary';
      case 'acknowledged': return 'default';
      case 'in_progress': return 'default';
      case 'resolved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const StatusTimeline = ({ grievance }: { grievance: Grievance }) => {
    return (
      <div className="space-y-4">
        <h4 className="font-medium">Status Timeline</h4>
        <div className="space-y-3">
          {grievance.statusHistory.map((entry, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${entry.isEscalation ? 'bg-warning' : 'bg-primary'}`}>
                {getStatusIcon(entry.status)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(entry.status)}>
                    {STATUS_LABELS[entry.status]}
                  </Badge>
                  {entry.isEscalation && (
                    <Badge variant="warning">Escalated</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  by {entry.updatedByName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                {entry.remarks && (
                  <p className="text-sm bg-muted p-2 rounded">{entry.remarks}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GrievanceCard = ({ grievance }: { grievance: Grievance }) => {
    const slaInfo = getTimeLeftForSLA(grievance);
    
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{grievance.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                <span>ID: {grievance.id}</span>
                <Badge variant="outline">{grievance.category}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(grievance.status)}>
                {STATUS_LABELS[grievance.status]}
              </Badge>
              {grievance.isEscalated && (
                <Badge variant="warning">Escalated</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm">{grievance.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              📍 {grievance.address}, {grievance.pincode}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant={getPriorityVariant(grievance.priority)} className="ml-1">
                  {PRIORITY_LABELS[grievance.priority]}
                </Badge>
              </div>
              {grievance.assignedToName && (
                <div>
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="ml-1 font-medium">{grievance.assignedToName}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">SLA Status:</p>
              <Badge 
                variant={
                  slaInfo.isBreached ? 'destructive' : 
                  slaInfo.isNearBreach ? 'warning' : 
                  'success'
                }
              >
                {slaInfo.display}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <StatusTimeline grievance={grievance} />
          
          <div className="text-xs text-muted-foreground">
            Created: {new Date(grievance.createdAt).toLocaleString()}
            {grievance.updatedAt !== grievance.createdAt && (
              <> • Updated: {new Date(grievance.updatedAt).toLocaleString()}</>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <RoleGuard allowedRoles={['citizen']}>
      <div className="min-h-screen bg-gradient-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Track Grievances</h1>
              <p className="text-muted-foreground mt-2">
                Monitor the status and progress of your submitted grievances
              </p>
            </div>

            {/* Search Section */}
            <Card className="shadow-government">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search by Grievance ID</span>
                </CardTitle>
                <CardDescription>
                  Enter your grievance ID to track a specific complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter Grievance ID (e.g., GRV_20240815_ABC123)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                {searchedGrievance && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Search Result:</h3>
                    <GrievanceCard grievance={searchedGrievance} />
                  </div>
                )}
                
                {searchId && !searchedGrievance && !isSearching && (
                  <div className="mt-4 text-center text-muted-foreground">
                    No grievance found with ID: {searchId}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User's Grievances */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Grievances</h2>
              
              {grievances.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Grievances Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted any grievances yet.
                    </p>
                    <Button asChild>
                      <a href="/raise">Raise Your First Grievance</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {grievances.map((grievance) => (
                    <motion.div
                      key={grievance.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <GrievanceCard grievance={grievance} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </RoleGuard>
  );
}