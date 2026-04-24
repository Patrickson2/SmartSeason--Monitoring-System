import { useState } from 'react';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'healthy' | 'at_risk' | 'critical';
  confidence: number;
}

interface CropAnalysisViewerProps {
  imageUrl: string | null;
  analysis: {
    total_crops: number;
    healthy: number;
    at_risk: number;
    critical: number;
    confidence_score: number;
    bounding_boxes: BoundingBox[];
  } | null;
  isAnalyzing: boolean;
}

export default function CropAnalysisViewer({ imageUrl, analysis, isAnalyzing }: CropAnalysisViewerProps) {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'at_risk': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#2196f3';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(76, 175, 80, 0.1)';
      case 'at_risk': return 'rgba(255, 152, 0, 0.1)';
      case 'critical': return 'rgba(244, 67, 54, 0.1)';
      default: return 'rgba(33, 150, 243, 0.1)';
    }
  };

  if (!imageUrl) {
    return (
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
          Crop Analysis
        </div>
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          Upload a drone image to see AI crop analysis
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-lg)' }}>
      {/* Image with Bounding Boxes */}
      <div>
        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>AI Detection Results</h4>
        <div style={{ 
          position: 'relative', 
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#000'
        }}>
          <img 
            src={imageUrl} 
            alt="Field analysis" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
          
          {/* Overlay bounding boxes */}
          {analysis && analysis.bounding_boxes.map((box) => (
            <div
              key={box.id}
              onMouseEnter={() => setSelectedBox(box.id)}
              onMouseLeave={() => setSelectedBox(null)}
              style={{
                position: 'absolute',
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                border: `2px solid ${getStatusColor(box.status)}`,
                backgroundColor: getStatusBg(box.status),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selectedBox === box.id ? 'scale(1.05)' : 'scale(1)',
                zIndex: selectedBox === box.id ? 10 : 1
              }}
            >
              {selectedBox === box.id && (
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '0',
                  backgroundColor: getStatusColor(box.status),
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {Math.round(box.confidence * 100)}% confidence
                </div>
              )}
            </div>
          ))}
          
          {/* Processing overlay */}
          {isAnalyzing && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)' }}>
                AI Processing
              </div>
              <p style={{ margin: 0 }}>Analyzing crops...</p>
              <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: '0.875rem', opacity: 0.8 }}>
                Detecting health patterns and growth stages
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results Panel */}
      <div>
        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>📊 Analysis Summary</h4>
        
        {analysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Overall Stats */}
            <div style={{
              backgroundColor: 'var(--color-surface)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Total Crops Detected:</strong> {analysis.total_crops}
              </div>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' }}></span>
                    Healthy:
                  </span>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{analysis.healthy}</span>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9800' }}></span>
                    At Risk:
                  </span>
                  <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{analysis.at_risk}</span>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f44336' }}></span>
                    Critical:
                  </span>
                  <span style={{ color: '#f44336', fontWeight: 'bold' }}>{analysis.critical}</span>
                </div>
              </div>
              <div style={{ 
                paddingTop: 'var(--spacing-sm)', 
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>AI Confidence:</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    {Math.round(analysis.confidence_score * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Status Legend */}
            <div style={{
              backgroundColor: 'var(--color-surface)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.875rem'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-sm)' }}>Status Legend:</div>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' }}></span>
                  <strong>Healthy:</strong> Good growth, no issues
                </span>
              </div>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9800' }}></span>
                  <strong>At Risk:</strong> Needs attention soon
                </span>
              </div>
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f44336' }}></span>
                  <strong>Critical:</strong> Immediate action required
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #4caf50'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', color: '#4caf50' }}>
                AI Recommendations:
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                {analysis.critical > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                    • Check {analysis.critical} critical crops immediately
                  </div>
                )}
                {analysis.at_risk > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                    • Monitor {analysis.at_risk} at-risk crops closely
                  </div>
                )}
                <div>
                  • Consider irrigation in next 2-3 days
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
            color: 'var(--color-text-muted)'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
              Analysis Pending
            </div>
            <p>Waiting for AI analysis...</p>
          </div>
        )}
      </div>
    </div>
  );
}
