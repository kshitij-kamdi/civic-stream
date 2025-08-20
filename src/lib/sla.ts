import { Grievance, GrievanceStatus } from './types';
import { updateGrievance } from './mockDb';

export function isNearSLABreach(grievance: Grievance): boolean {
  const now = new Date();
  const dueDate = new Date(grievance.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  const hoursLeft = timeDiff / (1000 * 60 * 60);
  
  // Consider near breach if less than 25% of SLA time remaining
  const warningThreshold = grievance.slaHours * 0.25;
  return hoursLeft <= warningThreshold && hoursLeft > 0;
}

export function isSLABreached(grievance: Grievance): boolean {
  const now = new Date();
  const dueDate = new Date(grievance.dueDate);
  
  return now > dueDate && !['resolved', 'rejected'].includes(grievance.status);
}

export function getTimeLeftForSLA(grievance: Grievance): {
  isBreached: boolean;
  isNearBreach: boolean;
  hoursLeft: number;
  display: string;
} {
  const now = new Date();
  const dueDate = new Date(grievance.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
  
  const isBreached = isSLABreached(grievance);
  const isNearBreach = isNearSLABreach(grievance);
  
  let display: string;
  
  if (isBreached) {
    const hoursOverdue = Math.abs(hoursLeft);
    display = `Overdue by ${hoursOverdue}h`;
  } else if (hoursLeft <= 0) {
    display = 'Due now';
  } else if (hoursLeft < 24) {
    display = `${hoursLeft}h left`;
  } else {
    const daysLeft = Math.ceil(hoursLeft / 24);
    display = `${daysLeft}d left`;
  }
  
  return {
    isBreached,
    isNearBreach,
    hoursLeft,
    display
  };
}

export function getNextStatusWithEscalation(currentStatus: GrievanceStatus): {
  nextStatus: GrievanceStatus;
  shouldEscalate: boolean;
} {
  const statusFlow: Record<GrievanceStatus, GrievanceStatus> = {
    submitted: 'acknowledged',
    acknowledged: 'in_progress',
    in_progress: 'resolved',
    resolved: 'resolved', // Terminal state
    rejected: 'rejected'  // Terminal state
  };
  
  const nextStatus = statusFlow[currentStatus];
  const shouldEscalate = currentStatus !== 'resolved' && currentStatus !== 'rejected';
  
  return {
    nextStatus,
    shouldEscalate
  };
}

export function autoEscalateGrievances(): Grievance[] {
  const { getGrievances } = require('./mockDb');
  const grievances: Grievance[] = getGrievances();
  const escalatedGrievances: Grievance[] = [];
  
  grievances.forEach(grievance => {
    // Only escalate if not already resolved/rejected and SLA is breached
    if (!['resolved', 'rejected'].includes(grievance.status) && isSLABreached(grievance) && !grievance.isEscalated) {
      const { nextStatus, shouldEscalate } = getNextStatusWithEscalation(grievance.status);
      
      if (shouldEscalate) {
        const escalatedGrievance = updateGrievance(
          grievance.id,
          {
            status: nextStatus,
            isEscalated: true,
            priority: grievance.priority === 'critical' ? 'critical' : (
              grievance.priority === 'high' ? 'critical' : (
                grievance.priority === 'medium' ? 'high' : 'medium'
              )
            )
          },
          'system',
          'Auto-Escalation System',
          `Auto-escalated due to SLA breach. Status changed from ${grievance.status} to ${nextStatus}`
        );
        
        if (escalatedGrievance) {
          escalatedGrievances.push(escalatedGrievance);
        }
      }
    }
  });
  
  return escalatedGrievances;
}

export function calculateSLAMetrics(grievances: Grievance[]) {
  const total = grievances.length;
  const withinSLA = grievances.filter(g => !isSLABreached(g) || ['resolved', 'rejected'].includes(g.status)).length;
  const breached = grievances.filter(g => isSLABreached(g)).length;
  const nearBreach = grievances.filter(g => isNearSLABreach(g)).length;
  
  return {
    total,
    withinSLA,
    breached,
    nearBreach,
    slaComplianceRate: total > 0 ? ((withinSLA / total) * 100).toFixed(1) : '100'
  };
}