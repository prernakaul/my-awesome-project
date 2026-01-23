import { useState, useEffect, useCallback } from 'react';
import { teamMemberApi } from '../services/api';
import type { TeamMember, CreateTeamMemberInput } from '../types';

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamMemberApi.getAll();
      setMembers(data);
    } catch {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const createMember = async (input: CreateTeamMemberInput) => {
    const member = await teamMemberApi.create(input);
    setMembers((prev) => [...prev, member]);
    return member;
  };

  const updateMember = async (id: string, input: Partial<CreateTeamMemberInput>) => {
    const member = await teamMemberApi.update(id, input);
    setMembers((prev) => prev.map((m) => (m.id === id ? member : m)));
    return member;
  };

  const deleteMember = async (id: string) => {
    await teamMemberApi.delete(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    refetch: fetchMembers,
  };
}
