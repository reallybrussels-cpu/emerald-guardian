export default async function handler(req, res) {

  const { code } = req.body;

  const SUPABASE_URL = "https://nifdzaiavwyqqhzipfwzi.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZmR6YWlhd3lxcXBoenBmd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODI2OTEsImV4cCI6MjA5MTI1ODY5MX0.nessE2dy7fwbiFK6hxvTRdKiiPnrhNHlksxZEFrhX7M";

  try {

    // BUSCA CÓDIGO
    const response = await fetch(`${SUPABASE_URL}/rest/v1/codes?code=eq.${code}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();

    if (!data.length) {
      return res.status(401).json({ error: "invalid" });
    }

    const item = data[0];

    if (!item.active) {
      return res.status(403).json({ error: "inactive" });
    }

    if (item.used >= item.limit) {
      return res.status(403).json({ error: "expired" });
    }

    // ATUALIZA USO
    await fetch(`${SUPABASE_URL}/rest/v1/codes?id=eq.${item.id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        used: item.used + 1
      })
    });

    return res.status(200).json({
      success: true,
      name: item.name,
      code: item.code
    });

  } catch (err) {
    return res.status(500).json({ error: "server_error" });
  }
}
