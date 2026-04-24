import { useState } from 'react';

interface AIInsightsProps {
  field: {
    name: string;
    crop_type: string;
    current_stage: string;
    status: string;
    planting_date?: string | null;
  };
}

export default function AIInsights({ field }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'weather' | 'harvest'>('recommendations');

  // Mock AI insights based on field data
  const getRecommendations = () => [
    {
      priority: 'high',
      title: 'Irrigation Needed',
      description: 'Soil moisture levels are 15% below optimal for this stage',
      action: 'Water within 24 hours'
    },
    {
      priority: 'medium',
      title: 'Pest Monitoring',
      description: 'Temperature conditions favor pest activity in this area',
      action: 'Inspect for signs of pests'
    },
    {
      priority: 'low',
      title: 'Growth Progress',
      description: 'Crop development is 5% ahead of schedule',
      action: 'Continue current care routine'
    }
  ];

  const getWeatherData = () => ({
    current: {
      temp: 24,
      humidity: 65,
      condition: 'Partly Cloudy'
    },
    forecast: [
      { day: 'Tomorrow', temp: '22-28°C', rain: '20%' },
      { day: 'Day 2', temp: '20-25°C', rain: '60%' },
      { day: 'Day 3', temp: '23-27°C', rain: '10%' }
    ]
  });

  const getHarvestPrediction = () => ({
    estimated_date: '2024-07-15',
    confidence: 87,
    factors: [
      { name: 'Current Growth Stage', impact: 'positive', detail: 'Optimal development' },
      { name: 'Weather Forecast', impact: 'neutral', detail: 'Suitable conditions expected' },
      { name: 'Historical Data', impact: 'positive', detail: 'Similar patterns observed' }
    ]
  });

  const recommendations = getRecommendations();
  const weatherData = getWeatherData();
  const harvestData = getHarvestPrediction();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
        <span>AI-Powered Insights</span>
        <span style={{
          fontSize: '0.75rem',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#4caf50',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 'normal'
        }}>
          Smart Analysis
        </span>
      </h3>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 'var(--spacing-md)'
      }}>
        {[
          { id: 'recommendations', label: 'Recommendations' },
          { id: 'weather', label: 'Weather' },
          { id: 'harvest', label: 'Harvest' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--color-border)',
        minHeight: '200px'
      }}>
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <div style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              AI-powered recommendations based on current field conditions and weather patterns
            </div>
            {recommendations.map((rec, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-sm)',
                  border: `1px solid ${getPriorityColor(rec.priority)}20`,
                  borderLeft: `4px solid ${getPriorityColor(rec.priority)}`
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{rec.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    {rec.description}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: getPriorityColor(rec.priority), fontWeight: 500 }}>
                    Action: {rec.action}
                  </div>
                </div>
                <div style={{
                  padding: '2px 8px',
                  backgroundColor: getPriorityColor(rec.priority),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  height: 'fit-content'
                }}>
                  {rec.priority.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weatherData.current.temp}°C</div>
                  <div style={{ color: 'var(--color-text-muted)' }}>{weatherData.current.condition}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Humidity</div>
                  <div style={{ fontWeight: 'bold' }}>{weatherData.current.humidity}%</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>3-Day Forecast</div>
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-xs) 0',
                  borderBottom: index < weatherData.forecast.length - 1 ? '1px solid var(--color-border)' : 'none'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{day.day}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{day.temp}</div>
                </div>
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: day.rain === '10%' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                  color: day.rain === '10%' ? '#4caf50' : '#ff9800',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  Rain: {day.rain}
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem'
            }}>
              <strong>AI Recommendation:</strong> Optimal conditions for field work in the next 2 days. Consider scheduling inspections.
            </div>
          </div>
        )}

        {/* Harvest Tab */}
        {activeTab === 'harvest' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #4caf50'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Estimated Harvest Date</div>
                <div style={{ fontSize: '1.25rem', color: '#4caf50', fontWeight: 'bold' }}>
                  {harvestData.estimated_date}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>AI Confidence</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {harvestData.confidence}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>Prediction Factors:</div>
            {harvestData.factors.map((factor, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-xs) 0',
                  fontSize: '0.875rem'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: factor.impact === 'positive' ? '#4caf50' : factor.impact === 'neutral' ? '#ff9800' : '#f44336'
                }}></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{factor.name}</div>
                  <div style={{ color: 'var(--color-text-muted)' }}>{factor.detail}</div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem'
            }}>
              <strong>AI Advisory:</strong> Current conditions suggest optimal harvest timing. Monitor weather changes as approach date.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
