import React, { useEffect, useState } from 'react';
import { fieldsApi, Field } from '../api/fields';
import { StatCard } from '../components/ui/StatCard';
import { FieldCard } from '../components/fields/FieldCard';

const Dashboard: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFields = async () => {
      try {
        const data = await fieldsApi.getFields();
        setFields(data);
      } catch (error) {
        console.error('Failed to load fields:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFields();
  }, []);

  const activeFields = fields.filter(f => f.status === 'active').length;
  const plantedFields = fields.filter(f => f.status === 'planted').length;
  const fallowFields = fields.filter(f => f.status === 'fallow').length;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="Total Fields" value={fields.length} color="#007bff" />
        <StatCard title="Active" value={activeFields} color="#28a745" />
        <StatCard title="Planted" value={plantedFields} color="#17a2b8" />
        <StatCard title="Fallow" value={fallowFields} color="#ffc107" />
      </div>
      <div className="recent-fields">
        <h2>Recent Fields</h2>
        <div className="fields-grid">
          {fields.slice(0, 6).map(field => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;