import React from 'react';
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function EditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // In a real app we'd fetch the workflow from DB here:
  // const { data } = await supabase.from('workflows').select('*').eq('id', params.id).single();
  
  return <WorkflowCanvas workflowId={params.id} initialName="Untitled Workflow" />;
}
