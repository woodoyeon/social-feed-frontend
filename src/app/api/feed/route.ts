// src/app/api/feed/route.ts
import { NextResponse } from 'next/server'

const DB = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  content: `기존 글 #${i + 1}`,
  author: { name: 'User'+((i%5)+1), username: 'user'+((i%5)+1) },
  createdAt: Date.now() - (i+1)*1000*60,
})).reverse()  // id 클수록 최신

export async function GET(req: Request) {
  const url = new URL(req.url)
  const after = Number(url.searchParams.get('after') ?? 0)
  const newer = DB.filter(p => p.id > after)
  return NextResponse.json(newer)
}
