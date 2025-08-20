import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  UserCheck,
  User,
  Shield
} from 'lucide-react';
import { getStats, getUsers, getGrievances } from '@/lib/mockDb';
import { calculateSLAMetrics } from '@/lib/sla';

export default function Admin() {
  const stats = getStats();
  const users = getUsers();
  const grievances = getGrievances();
  const slaMetrics = calculateSLAMetrics(grievances);

  const recentActivity = [
    { action: 'New grievance submitted', user: 'John Doe', time: '2 minutes ago', type: 'grievance' },
    { action: 'Official registered', user: 'Sarah Kumar', time: '1 hour ago', type: 'user' },
    { action: 'Grievance escalated', user: 'System', time: '3 hours ago', type: 'escalation' },
    { action: 'Grievance resolved', user: 'Raj Patel', time: '5 hours ago', type: 'resolution' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'grievance': return <FileText className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'escalation': return <AlertTriangle className="h-4 w-4" />;
      case 'resolution': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'grievance': return 'bg-primary';
      case 'user': return 'bg-accent';
      case 'escalation': return 'bg-warning';
      case 'resolution': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="grievances">Grievances</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalGrievances}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingGrievances} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{slaMetrics.slaComplianceRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {slaMetrics.breached} breached
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCitizens + stats.totalOfficials}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalCitizens} citizens, {stats.totalOfficials} officials
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.escalatedGrievances}</div>
                    <p className="text-xs text-muted-foreground">
                      Requiring attention
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-muted rounded-full">
                            {user.role === 'citizen' && <User className="h-4 w-4" />}
                            {user.role === 'official' && <UserCheck className="h-4 w-4" />}
                            {user.role === 'admin' && <Shield className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.department && (
                              <p className="text-xs text-muted-foreground">Dept: {user.department}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'official' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'success' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grievances" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Submitted</span>
                        <Badge variant="secondary">
                          {grievances.filter(g => g.status === 'submitted').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">In Progress</span>
                        <Badge variant="default">
                          {grievances.filter(g => g.status === 'in_progress').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Resolved</span>
                        <Badge variant="success">
                          {grievances.filter(g => g.status === 'resolved').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Escalated</span>
                        <Badge variant="warning">
                          {stats.escalatedGrievances}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SLA Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Within SLA</span>
                        <Badge variant="success">{slaMetrics.withinSLA}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Near Breach</span>
                        <Badge variant="warning">{slaMetrics.nearBreach}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Breached</span>
                        <Badge variant="destructive">{slaMetrics.breached}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Compliance Rate</span>
                        <Badge variant="default">{slaMetrics.slaComplianceRate}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      Export Reports
                    </Button>
                    <Button className="w-full" variant="outline">
                      System Backup
                    </Button>
                    <Button className="w-full" variant="outline">
                      Send Notifications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system parameters and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-escalation</p>
                        <p className="text-sm text-muted-foreground">Automatically escalate overdue grievances</p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send email updates to users</p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Send SMS updates for critical issues</p>
                      </div>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  );
}