import React from 'react';
import { NextResponse } from 'next/server';

export default function KeywordsPage() {
  return NextResponse.json({ error: 'This page should not be accessed directly' }, { status: 404 });
}
