import { v4 as uuidv4 } from 'uuid';
import { getTeamMembers, saveTeamMembers } from '../storage/localStorage.js';
import type { TeamMember, CreateTeamMemberInput } from '../types/index.js';

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return getTeamMembers();
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  return members.find((m) => m.id === id) || null;
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<TeamMember> {
  const members = await getTeamMembers();
  const newMember: TeamMember = {
    id: uuidv4(),
    name: input.name,
    email: input.email,
    color: input.color,
    createdAt: new Date().toISOString(),
  };
  members.push(newMember);
  await saveTeamMembers(members);
  return newMember;
}

export async function updateTeamMember(
  id: string,
  input: Partial<CreateTeamMemberInput>
): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) return null;

  members[index] = { ...members[index], ...input };
  await saveTeamMembers(members);
  return members[index];
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const members = await getTeamMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) return false;

  members.splice(index, 1);
  await saveTeamMembers(members);
  return true;
}
