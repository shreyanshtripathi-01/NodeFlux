import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { execute } from "@/lib/engine/executor";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { workflowId, input } = await req.json();
  if (!workflowId) return NextResponse.json({ error: "missing workflowId" }, { status: 400 });

  const { data: wf, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .eq("user_id", user.id)
    .single();

  if (error || !wf) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { data: run } = await supabase
    .from("workflow_runs")
    .insert({ workflow_id: wf.id, user_id: user.id, status: "running", input: input ?? {} })
    .select()
    .single();

  try {
    const result = await execute({
      nodes: Array.isArray(wf.nodes) ? wf.nodes : [],
      edges: Array.isArray(wf.edges) ? wf.edges : [],
      workflowInput: input ?? {},
    });

    await supabase
      .from("workflow_runs")
      .update({
        status: "success",
        output: result.finalOutput,
        node_outputs: result.nodeOutputs,
        finished_at: new Date().toISOString(),
      })
      .eq("id", run!.id);

    return NextResponse.json({ runId: run!.id, ...result });
  } catch (e: any) {
    await supabase
      .from("workflow_runs")
      .update({
        status: "failed",
        error: e.message || "unknown error",
        finished_at: new Date().toISOString(),
      })
      .eq("id", run!.id);

    return NextResponse.json({ error: e.message || "execution failed", ...(e.partialLogs ? { partialLogs: e.partialLogs, nodeOutputs: e.nodeOutputs } : {}) }, { status: 500 });
  }
}
