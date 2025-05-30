import Dexie from "dexie";
import type { Table } from "dexie"; 

export interface Profile {
  id: string;        // could be peerId or "self"
  name: string;
  lastActive: Date;
}

class WebRTCAppDB extends Dexie {
  profiles!: Table<Profile, string>;

  constructor() {
    super("WebRTCAppDB");
    this.version(1).stores({
      profiles: "id, name, lastActive",
    });
  }
}

export const db = new WebRTCAppDB();
