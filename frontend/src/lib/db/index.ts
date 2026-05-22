import Dexie, { type Table } from "dexie";

export interface Story {
  id?: number;
  remoteId: string;
  title: string;
  content: string;
  updatedAt: number;
  synced: boolean;
}

class HeritageDB extends Dexie {
  stories!: Table<Story>;

  constructor() {
    super("heritage-db");
    this.version(1).stores({
      stories: "++id, remoteId, synced",
    });
  }
}

export const db = new HeritageDB();
