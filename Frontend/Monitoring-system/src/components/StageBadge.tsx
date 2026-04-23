import type { CropStage } from '../types';

const stageColors: Record<CropStage, string> = {
  planted: 'var(--color-accent)',
  growing: 'var(--color-primary-light)',
  ready: 'var(--color-accent-light)',
  harvested: 'var(--color-text-muted)',
};

const stageLabels: Record<CropStage, string> = {
  planted: 'Planted',
  growing: 'Growing',
  ready: 'Ready',
  harvested: 'Harvested',
};

export default function StageBadge({ stage }: { stage: CropStage }) {
  const color = stageColors[stage] || '#6b7280';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 500, backgroundColor: color, color: 'white', textTransform: 'capitalize' }}>
      {stageLabels[stage] || stage}
    </span>
  );
}