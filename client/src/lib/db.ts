import Dexie from "dexie";
import type { Table } from "dexie"; 

export interface Profile {
  id: string;        // could be peerId or "self"
  name: string;
  lastActive: Date;
}

export type Room = {
  id: string;
  name: string;
  createdBy: string;
  participants: string[];
  createdAt: Date;
};


class WebRTCAppDB extends Dexie {
  profiles!: Table<Profile, string>;
  rooms!: Table<Room, string>;

  constructor() {
    super("WebRTCAppDB");
    this.version(2).stores({
      profiles: "id, name, lastActive",
      rooms: "id, name, createdBy, createdAt"
    });
  }
}


export const db = new WebRTCAppDB();
