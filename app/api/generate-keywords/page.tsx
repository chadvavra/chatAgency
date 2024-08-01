import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'This page should not be accessed directly' }, { status: 404 });
}

export const dynamic = 'force-dynamic';
