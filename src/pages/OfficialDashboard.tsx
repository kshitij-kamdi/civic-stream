import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Play,
  UserCheck,
  Filter,
  Search
} from 'lucide-react';
import { getAuthUser, getGrievances, updateGrievance, getUsers } from '@/lib/mockDb';
import { Grievance, STATUS_LABELS, PRIORITY_LABELS, User } from '@/lib/types';
import { getTimeLeftForSLA } from '@/lib/sla';

export default function OfficialDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([]);
  const [officials, setOfficials] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'acknowledge' | 'start' | 'resolve' | 'reassign' | null;
  }>({ open: false, action: null });
  const [actionData, setActionData] = useState({
    remarks: '',
    assignTo: ''
  });
  
  const authUser = getAuthUser();

  useEffect(() => {
    const allGrievances = getGrievances();
    const allOfficials = getUsers().filter(u => u.role === 'official');
    setOfficials(allOfficials);
    
    // Filter grievances for current official or show all if admin
    const filteredByRole = authUser?.role === 'admin' 
      ? allGrievances 
      : allGrievances.filter(g => 
          g.assignedTo === authUser?.id || 
          !g.assignedTo || 
          (authUser?.department && g.category.includes(authUser.department.toLowerCase()))
        );
    
    setGrievances(filteredByRole);
    setFilteredGrievances(filteredByRole);
  }, [authUser]);

  useEffect(() => {
    let filtered = [...grievances];
    
    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(g => g.category === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter(g => g.priority === filters.priority);
    }
    if (filters.search) {
      filtered = filtered.filter(g => 
        g.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        g.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setFilteredGrievances(filtered);
  }, [filters, grievances]);

  const handleAction = async (grievance: Grievance, action: string) => {
    if (!authUser) return;
    
    let newStatus = grievance.status;
    let updates: Partial<Grievance> = {};
    
    switch (action) {
      case 'acknowledge':
        newStatus = 'acknowledged';
        updates = { assignedTo: authUser.id, assignedToName: authUser.name };
        break;
      case 'start':
        newStatus = 'in_progress';
        break;
      case 'resolve':
        newStatus = 'resolved';
        break;
      case 'reassign':
        const newOfficial = officials.find(o => o.id === actionData.assignTo);
        updates = { 
          assignedTo: actionData.assignTo, 
          assignedToName: newOfficial?.name || '' 
        };
        break;
    }
    
    const updatedGrievance = updateGrievance(
      grievance.id,
      { ...updates, status: newStatus },
      authUser.id,
      authUser.name,
      actionData.remarks || `${action.charAt(0).toUpperCase() + action.slice(1)} action performed`
    );
    
    if (updatedGrievance) {
      setGrievances(prev => prev.map(g => g.id === grievance.id ? updatedGrievance : g));
      toast({
        title: "Action Completed",
        description: `Grievance ${grievance.id} has been ${action}d successfully.`
      });
    }
    
    setActionDialog({ open: false, action: null });
    setActionData({ remarks: '', assignTo: '' });
  };

  const openActionDialog = (grievance: Grievance, action: 'acknowledge' | 'start' | 'resolve' | 'reassign') => {
    setSelectedGrievance(grievance);
    setActionDialog({ open: true, action });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'acknowledged': return <Eye className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
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

  const stats = {
    total: filteredGrievances.length,
    pending: filteredGrievances.filter(g => !['resolved', 'rejected'].includes(g.status)).length,
    escalated: filteredGrievances.filter(g => g.isEscalated).length,
    slaBreached: filteredGrievances.filter(g => getTimeLeftForSLA(g).isBreached).length
  };

  return (
    <RoleGuard allowedRoles={['official', 'admin']}>
      <div className="min-h-screen bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Official Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and resolve citizen grievances efficiently
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.escalated}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SLA Breached</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.slaBreached}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="cases" className="space-y-6">
            <TabsList>
              <TabsTrigger value="cases">All Cases</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="escalated">Escalated</TabsTrigger>
            </TabsList>

            <TabsContent value="cases" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="ID, title, description..."
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="acknowledged">Acknowledged</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="water_supply">Water Supply</SelectItem>
                          <SelectItem value="roads">Roads</SelectItem>
                          <SelectItem value="public_transport">Public Transport</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Priorities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grievances Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4 font-medium">ID</th>
                          <th className="p-4 font-medium">Category</th>
                          <th className="p-4 font-medium">Title</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Priority</th>
                          <th className="p-4 font-medium">SLA</th>
                          <th className="p-4 font-medium">Assignee</th>
                          <th className="p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGrievances.map((grievance) => {
                          const slaInfo = getTimeLeftForSLA(grievance);
                          return (
                            <tr key={grievance.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">
                                <div>
                                  <p className="font-mono text-sm">{grievance.id}</p>
                                  {grievance.isEscalated && (
                                    <Badge variant="warning" className="mt-1">Escalated</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline">{grievance.category}</Badge>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{grievance.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {grievance.citizenName}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant={getStatusVariant(grievance.status)}>
                                  {getStatusIcon(grievance.status)}
                                  <span className="ml-1">{STATUS_LABELS[grievance.status]}</span>
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge variant={getPriorityVariant(grievance.priority)}>
                                  {PRIORITY_LABELS[grievance.priority]}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge 
                                  variant={
                                    slaInfo.isBreached ? 'destructive' : 
                                    slaInfo.isNearBreach ? 'warning' : 
                                    'success'
                                  }
                                >
                                  {slaInfo.display}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <p className="text-sm">
                                  {grievance.assignedToName || 'Unassigned'}
                                </p>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-1">
                                  {grievance.status === 'submitted' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openActionDialog(grievance, 'acknowledge')}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {grievance.status === 'acknowledged' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openActionDialog(grievance, 'start')}
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {grievance.status === 'in_progress' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openActionDialog(grievance, 'resolve')}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openActionDialog(grievance, 'reassign')}
                                  >
                                    <UserCheck className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Pending Cases View</h3>
                <p className="text-muted-foreground">Filter for pending cases in the All Cases tab</p>
              </div>
            </TabsContent>

            <TabsContent value="escalated">
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Escalated Cases View</h3>
                <p className="text-muted-foreground">Filter for escalated cases in the All Cases tab</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'acknowledge' && 'Acknowledge Grievance'}
              {actionDialog.action === 'start' && 'Start Processing'}
              {actionDialog.action === 'resolve' && 'Resolve Grievance'}
              {actionDialog.action === 'reassign' && 'Reassign Grievance'}
            </DialogTitle>
            <DialogDescription>
              {selectedGrievance && `Take action on grievance ${selectedGrievance.id}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {actionDialog.action === 'reassign' && (
              <div className="space-y-2">
                <Label>Assign to Official</Label>
                <Select value={actionData.assignTo} onValueChange={(value) => setActionData({ ...actionData, assignTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an official" />
                  </SelectTrigger>
                  <SelectContent>
                    {officials.map((official) => (
                      <SelectItem key={official.id} value={official.id}>
                        {official.name} - {official.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Add remarks about this action..."
                value={actionData.remarks}
                onChange={(e) => setActionData({ ...actionData, remarks: e.target.value })}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => selectedGrievance && handleAction(selectedGrievance, actionDialog.action!)}
                className="flex-1"
              >
                Confirm Action
              </Button>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, action: null })}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}