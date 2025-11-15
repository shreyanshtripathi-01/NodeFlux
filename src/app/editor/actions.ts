"use server";

import { createClient } from "@/utils/supabase/server";

export async function createWorkflow(data: {
  name: string;
  nodes: unknown[];
  edges: unknown[];
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({ user_id: user.id, name: data.name, nodes: data.nodes, edges: data.edges })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: workflow };
}

export async function updateWorkflow(
  id: string,
  data: { name?: string; nodes?: unknown[]; edges?: unknown[] }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: workflow, error } = await supabase
    .from("workflows")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: workflow };
}

export async function getWorkflow(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getUserWorkflows() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("workflows")
    .select("id, name, nodes, edges, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return { error: error.message };

  const enriched = data.map((w) => ({
    id: w.id,
    name: w.name,
    node_count: ((w.nodes as any[]) || []).length,
    nodes: w.nodes,
    edges: w.edges,
    updated_at: w.updated_at,
  }));

  return { data: enriched };
}

export async function createRun(data: {
  workflow_id: string;
  workflow_name: string;
  status?: string;
  duration?: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: run, error } = await supabase
    .from("runs")
    .insert({
      workflow_id: data.workflow_id,
      user_id: user.id,
      workflow_name: data.workflow_name,
      status: data.status || "success",
      duration: data.duration || "0.3s",
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: run };
}

export async function deleteWorkflow(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getUserRuns() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}