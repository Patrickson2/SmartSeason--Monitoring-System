import React, { useEffect, useState } from 'react';
import { usersApi, User } from '../api/users';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await usersApi.getUsers();
        setAgents(data.filter(u => u.role === 'agent'));
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAgents();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="agents-page">
      <h1>Agents</h1>
      <table className="agents-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent.id}>
              <td>{agent.username}</td>
              <td>{agent.email}</td>
              <td>{agent.full_name || 'N/A'}</td>
              <td>{agent.is_active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Agents;