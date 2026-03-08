import { BaZiRecord } from './bazi';

const STORAGE_KEY = 'bazi-records';

export function saveRecord(record: BaZiRecord): void {
  const records = getRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getRecords(): BaZiRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getRecord(id: string): BaZiRecord | undefined {
  return getRecords().find(r => r.id === id);
}
