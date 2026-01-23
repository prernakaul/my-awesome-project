import { Router } from 'express';
import * as teamMemberService from '../services/teamMemberService.js';

const router = Router();

router.get('/', async (_req, res) => {
  const members = await teamMemberService.getAllTeamMembers();
  res.json({ data: members, success: true });
});

router.post('/', async (req, res) => {
  const { name, email, color } = req.body;
  if (!name || !color) {
    res.status(400).json({ error: 'Name and color are required', success: false });
    return;
  }
  const member = await teamMemberService.createTeamMember({ name, email, color });
  res.status(201).json({ data: member, success: true });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const member = await teamMemberService.updateTeamMember(id, req.body);
  if (!member) {
    res.status(404).json({ error: 'Team member not found', success: false });
    return;
  }
  res.json({ data: member, success: true });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await teamMemberService.deleteTeamMember(id);
  if (!deleted) {
    res.status(404).json({ error: 'Team member not found', success: false });
    return;
  }
  res.json({ success: true });
});

export default router;
