import { NextResponse } from 'next/server';
import { executeDAG } from '@/lib/engine';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nodes, edges } = body;

    if (!nodes || !edges) {
      return NextResponse.json({ error: 'Missing nodes or edges' }, { status: 400 });
    }

    const result = await executeDAG(nodes, edges);
    
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
