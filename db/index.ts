import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqlite = SQLite.openDatabaseSync("ritual.db");

export const db = drizzle(sqlite, { schema });
