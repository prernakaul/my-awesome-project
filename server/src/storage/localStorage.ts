import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Chore, TeamMember } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const CHORES_FILE = path.join(DATA_DIR, 'chores.json');
const MEMBERS_FILE = path.join(DATA_DIR, 'teamMembers.json');

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await readJsonFile<{ members: TeamMember[] }>(MEMBERS_FILE, { members: [] });
  return data.members;
}

export async function saveTeamMembers(members: TeamMember[]): Promise<void> {
  await writeJsonFile(MEMBERS_FILE, { members });
}

// Chores
export async function getChores(): Promise<Chore[]> {
  const data = await readJsonFile<{ chores: Chore[] }>(CHORES_FILE, { chores: [] });
  return data.chores;
}

export async function saveChores(chores: Chore[]): Promise<void> {
  await writeJsonFile(CHORES_FILE, { chores });
}
