import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const conditions = [eq(jobs.isActive, true)];
  if (category && category !== "All") {
    conditions.push(eq(jobs.category, category));
  }

  const result = await db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.sortOrder), desc(jobs.createdAt));

  return NextResponse.json(result, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
