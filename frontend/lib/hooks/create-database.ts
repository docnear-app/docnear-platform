import { createRxDatabase, type RxCollection, type RxDatabase } from 'rxdb/plugins/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import type { RxJsonSchema } from 'rxdb';

type DocnearCollections = {
  users: RxCollection<UserDoc>;
};

export type DocnearDatabase = RxDatabase<DocnearCollections>;

export interface UserDoc {
  id: string;
  email: string;
  updatedAt: number;
}

const userSchema: RxJsonSchema<UserDoc> = {
  title: 'user',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string' },
    updatedAt: { type: 'number' },
  },
  required: ['id', 'email', 'updatedAt'],
  indexes: ['email', 'updatedAt'],
};

const collections = {
  users: {
    schema: userSchema,
  },
};

export async function createDatabase(name = 'docnear'): Promise<DocnearDatabase> {
  const db = await createRxDatabase<DocnearCollections>({
    name,
    storage: getRxStorageDexie(),
  });
  await db.addCollections(collections);
  return db;
}
