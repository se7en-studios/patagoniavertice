// Aviso por mail de un lead nuevo vía Resend (fetch, sin dependencias).
// No hace nada si faltan RESEND_API_KEY / LEAD_NOTIFY_TO. Nunca rompe el guardado del lead.
export async function notificarLead(
  asunto: string,
  campos: Record<string, string | null | undefined>,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!key || !to) return;

  const text = Object.entries(campos)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.LEAD_NOTIFY_FROM || "ALTUM SCI <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()),
        subject: asunto,
        text,
      }),
    });
    if (!res.ok) console.error("[notificarLead] Resend", res.status);
  } catch (e) {
    console.error("[notificarLead] error", e);
  }
}
