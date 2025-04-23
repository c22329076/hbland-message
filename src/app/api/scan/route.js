export async function POST(request) {
    try {
	  const YOUR_API_URL = "";
	  
      const { s_SbSX731, s_VbJ7gs3, s_Nuu3763 } = await request.json();

      const stringToMd5 = "";
  
      const crypto = await import("node:crypto");
      const s_4GGX7cx = crypto.createHash("md5").update(stringToMd5).digest("hex");
  
      const params = new URLSearchParams({
        s_SbSX731,
        s_VbJ7gs3,
        s_Nuu3763,
        s_4GGX7cx,
      });
  
      const url = `YOUR_API_URL?${params.toString()}`;
      const res = await fetch(url);
      const text = await res.text();
  
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { status_code: "99", status_defn: "格式錯誤", raw: text };
      }
  
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ status_code: "98", error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  