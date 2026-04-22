import React, { useEffect, useState } from 'react';
import { fieldsApi, Field } from '../api/fields';
import { StatCard } from '../components/ui/StatCard';
import { FieldCard } from '../components/fields/FieldCard';

const AgentDashboard: React.FC = () => {
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

  const myFields = fields.length;
  const activeFields = fields.filter(f => f.status === 'active').length;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="agent-dashboard">
      <h1>My Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="My Fields" value={myFields} color="#007bff" />
        <StatCard title="Active" value={activeFields} color="#28a745" />
      </div>
      <div className="my-fields">
        <h2>My Fields</h2>
        <div className="fields-grid">
          {fields.map(field => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;