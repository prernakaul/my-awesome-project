import { Router } from 'express';
import * as choreService from '../services/choreService.js';

const router = Router();

router.get('/', async (_req, res) => {
  const chores = await choreService.getAllChores();
  res.json({ data: chores, success: true });
});

router.get('/calendar', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    res.status(400).json({ error: 'start and end query parameters are required', success: false });
    return;
  }
  const rangeStart = new Date(start as string);
  const rangeEnd = new Date(end as string);
  const events = await choreService.getCalendarEvents(rangeStart, rangeEnd);
  res.json({ data: events, success: true });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const chore = await choreService.getChoreById(id);
  if (!chore) {
    res.status(404).json({ error: 'Chore not found', success: false });
    return;
  }
  res.json({ data: chore, success: true });
});

router.post('/', async (req, res) => {
  const { title, startDate, endDate, allDay, recurrence } = req.body;
  if (!title || !startDate || !endDate || allDay === undefined || !recurrence) {
    res.status(400).json({
      error: 'title, startDate, endDate, allDay, and recurrence are required',
      success: false,
    });
    return;
  }
  const chore = await choreService.createChore(req.body);
  res.status(201).json({ data: chore, success: true });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const chore = await choreService.updateChore(id, req.body);
  if (!chore) {
    res.status(404).json({ error: 'Chore not found', success: false });
    return;
  }
  res.json({ data: chore, success: true });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await choreService.deleteChore(id);
  if (!deleted) {
    res.status(404).json({ error: 'Chore not found', success: false });
    return;
  }
  res.json({ success: true });
});

export default router;
