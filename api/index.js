import { TSNet } from "@tailscale/tsnet";

export default async function handler(req, res) {
  const TS_AUTHKEY = process.env.TS_AUTHKEY;
  const FNYOU_URL = "http://100.123.109.84:5666";

  if (!TS_AUTHKEY) {
    return res.status(500).send("请设置 TS_AUTHKEY 环境变量");
  }

  const ts = new TSNet({
    authKey: TS_AUTHKEY,
  });

  try {
    await ts.start();
    const url = FNYOU_URL + req.url;
    const response = await ts.fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" ? req.body : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).send("连接飞牛失败：" + e.message);
  } finally {
    await ts.close();
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
