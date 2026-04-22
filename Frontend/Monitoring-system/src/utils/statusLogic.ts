import { FieldStatus, CropStage } from '../types';

export const getStatusColor = (status: FieldStatus): string => {
  const colors: Record<FieldStatus, string> = {
    active: '#28a745',
    fallow: '#ffc107',
    planted: '#17a2b8',
    harvested: '#6c757d',
  };
  return colors[status] || '#ccc';
};

export const getStageColor = (stage: CropStage): string => {
  const colors: Record<CropStage, string> = {
    germination: '#FFA500',
    vegetative: '#90EE90',
    flowering: '#FF69B4',
    fruiting: '#FFD700',
    mature: '#228B22',
  };
  return colors[stage] || '#ccc';
};

export const canUpdateField = (currentStage: CropStage): boolean => {
  return true;
};

export const getNextStage = (currentStage: CropStage): CropStage | null => {
  const stages: CropStage[] = ['germination', 'vegetative', 'flowering', 'fruiting', 'mature'];
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null;
  }
  return stages[currentIndex + 1];
};

export const isFieldOverdue = (expectedDate: string | undefined): boolean => {
  if (!expectedDate) return false;
  return new Date(expectedDate) < new Date();
};