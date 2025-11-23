export function interpolate(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, path: string) => {
    const keys = path.split(".");
    let value: any = context;
    for (const key of keys) {
      if (value == null || typeof value !== "object") return "";
      value = value[key];
    }
    return value != null ? String(value) : "";
  });
}

export function resolveRefs(
  obj: Record<string, any>,
  context: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = interpolate(value, context);
    } else if (value != null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = resolveRefs(value, context);
    } else {
      result[key] = value;
    }
  }
  return result;
}
