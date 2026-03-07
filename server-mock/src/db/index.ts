import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Database } from '../types.js';

const currentDirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(currentDirname, '../../data/db.json');

// Инициализируем базу данных с пустой структурой
const defaultData: Database = {
  users: [],
  roles: [],
  user_roles: [],
  profiles: [],
  posts: [],
  post_tags: [],
  post_photos: [],
  post_videos: [],
  post_texts: [],
  post_locations: [],
  post_surveys: [],
  survey_answers: [],
  post_authors: [],
};

const adapter = new JSONFile<Database>(dbPath);
const db = new Low<Database>(adapter, defaultData);

// Инициализация БД
export async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
}

// Хелперы для работы с данными
export async function readDB() {
  await db.read();
  return db.data!;
}

export async function writeDB() {
  await db.write();
}

// CRUD операции для любой таблицы
export async function getAll<K extends keyof Database>(table: K): Promise<Database[K]> {
  const data = await readDB();
  return data[table];
}

export async function getById<K extends keyof Database>(
  table: K,
  id: string,
): Promise<Database[K][number] | undefined> {
  const data = await readDB();
  return data[table].find((item) => item.id === id);
}

export async function getByField<K extends keyof Database>(
  table: K,
  field: string,
  value: Database[K][number][keyof Database[K][number]],
): Promise<Database[K][number] | undefined> {
  const data = await readDB();
  return data[table].find((item) => item[field as keyof typeof item] === value);
}

export async function getAllByField<K extends keyof Database>(
  table: K,
  field: string,
  value: unknown,
): Promise<Database[K]> {
  const data = await readDB();
  return data[table].filter((item) => item[field as keyof typeof item] === value) as Database[K];
}

export async function create<K extends keyof Database>(
  table: K,
  item: Database[K][number],
): Promise<Database[K][number]> {
  const data = await readDB();
  data[table].push(item as never);
  await writeDB();
  return item;
}

export async function update<K extends keyof Database>(
  table: K,
  id: string,
  updates: Partial<Database[K][number]>,
): Promise<Database[K][number] | null> {
  const data = await readDB();
  const index = data[table].findIndex((item) => item.id === id);

  if (index === -1) return null;

  data[table][index] = { ...data[table][index], ...updates };
  await writeDB();
  return data[table][index];
}

export async function remove<K extends keyof Database>(table: K, id: string): Promise<boolean> {
  const data = await readDB();
  const index = data[table].findIndex((item) => item.id === id);

  if (index === -1) return false;

  data[table].splice(index, 1);
  await writeDB();
  return true;
}

export { db };
