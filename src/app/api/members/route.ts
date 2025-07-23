// src/app/api/members/route.ts
import { getMembers } from '@/ai/flows/get-members';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getMembers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
