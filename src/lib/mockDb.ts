import { User, Grievance, AuthUser, SeedData } from './types';

const STORAGE_KEYS = {
  USERS: 'egovportal_users',
  GRIEVANCES: 'egovportal_grievances',
  AUTH: 'egovportal_auth',
  INITIALIZED: 'egovportal_initialized'
};

// Initialize database with seed data
export async function initializeDatabase(): Promise<void> {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true') {
    return;
  }

  try {
    // Load seed data
    const response = await fetch('/data/seed.json');
    const seedData: SeedData = await response.json();
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedData.users));
    localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(seedData.grievances));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    
    console.log('Database initialized with seed data');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Fallback to empty arrays
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// User operations
export function getUsers(): User[] {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

export function getUserById(id: string): User | null {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
}

export function getUserByCredentials(email: string, phone: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email || user.phone === phone) || null;
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return users[userIndex];
}

// Grievance operations
export function getGrievances(): Grievance[] {
  const grievances = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
  return grievances ? JSON.parse(grievances) : [];
}

export function getGrievanceById(id: string): Grievance | null {
  const grievances = getGrievances();
  return grievances.find(grievance => grievance.id === id) || null;
}

export function getGrievancesByCitizen(citizenId: string): Grievance[] {
  const grievances = getGrievances();
  return grievances.filter(grievance => grievance.citizenId === citizenId);
}

export function getGrievancesByOfficial(officialId: string): Grievance[] {
  const grievances = getGrievances();
  return grievances.filter(grievance => grievance.assignedTo === officialId);
}

export function createGrievance(grievanceData: Omit<Grievance, 'id' | 'createdAt' | 'updatedAt' | 'dueDate' | 'statusHistory'>): Grievance {
  const grievances = getGrievances();
  const now = new Date().toISOString();
  const dueDate = new Date(Date.now() + grievanceData.slaHours * 60 * 60 * 1000).toISOString();
  
  const newGrievance: Grievance = {
    ...grievanceData,
    id: `GRV_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    dueDate,
    statusHistory: [{
      status: 'submitted',
      timestamp: now,
      updatedBy: grievanceData.citizenId,
      updatedByName: grievanceData.citizenName,
      remarks: 'Grievance submitted'
    }]
  };
  
  grievances.push(newGrievance);
  localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(grievances));
  
  return newGrievance;
}

export function updateGrievance(id: string, updates: Partial<Grievance>, updatedBy: string, updatedByName: string, remarks?: string): Grievance | null {
  const grievances = getGrievances();
  const grievanceIndex = grievances.findIndex(grievance => grievance.id === id);
  
  if (grievanceIndex === -1) return null;
  
  const now = new Date().toISOString();
  const grievance = grievances[grievanceIndex];
  
  // Add status history entry if status is changing
  if (updates.status && updates.status !== grievance.status) {
    const statusHistoryEntry = {
      status: updates.status,
      timestamp: now,
      updatedBy,
      updatedByName,
      remarks,
      isEscalation: updates.isEscalated && !grievance.isEscalated
    };
    
    grievance.statusHistory.push(statusHistoryEntry);
  }
  
  grievances[grievanceIndex] = {
    ...grievance,
    ...updates,
    updatedAt: now
  };
  
  localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(grievances));
  
  return grievances[grievanceIndex];
}

// Authentication
export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
  return auth ? JSON.parse(auth) : null;
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// Statistics
export function getStats() {
  const grievances = getGrievances();
  const users = getUsers();
  
  const totalGrievances = grievances.length;
  const pendingGrievances = grievances.filter(g => !['resolved', 'rejected'].includes(g.status)).length;
  const resolvedGrievances = grievances.filter(g => g.status === 'resolved').length;
  const escalatedGrievances = grievances.filter(g => g.isEscalated).length;
  
  const totalCitizens = users.filter(u => u.role === 'citizen').length;
  const totalOfficials = users.filter(u => u.role === 'official').length;
  
  return {
    totalGrievances,
    pendingGrievances,
    resolvedGrievances,
    escalatedGrievances,
    totalCitizens,
    totalOfficials
  };
}