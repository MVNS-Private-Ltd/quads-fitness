import { getSettings, getPrograms, getPlans, getTrainers } from '../services/api';

export async function fetchSettings() {
  return await getSettings();
}

export async function fetchActivePrograms() {
  const allPrograms = await getPrograms('?all=true');
  return allPrograms.filter(p => p.status === 'Active');
}

export async function fetchActiveMembershipPlans() {
  const allPlans = await getPlans('?all=true');
  return allPlans.filter(p => p.status === 'Active');
}

export async function fetchTrainers({ all = false } = {}) {
  const trainers = await getTrainers('?all=true');
  if (all) return trainers;
  return trainers.filter(t => t.status === 'Active');
}
