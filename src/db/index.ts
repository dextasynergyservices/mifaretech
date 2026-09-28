// import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schema";

const connectionString =
  env.DATABASE_URL ||
  "postgresql://mock_user:mock_pass@ep-mock-ci.eu-central-1.aws.neon.tech/mock_db?sslmode=require";

export const db = drizzle({ client: neon(connectionString), schema });
export type Db = typeof db;
