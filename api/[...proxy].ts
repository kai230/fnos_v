// 配置为 Edge 函数，全球节点转发，速度最快
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    // 替换为你的飞牛 Tailscale 地址（已帮你填好）
    const TARGET_URL = 'http://100.123.109.84:5666/';
    const url = new URL(req.url);
    
    // 拼接请求路径，保证飞牛后台的所有页面都能正常访问
    const targetPath = url.pathname.replace('/api', '') + url.search;
    const fullTargetUrl = new URL(targetPath, TARGET_URL).href;

    // 转发请求到飞牛 Tailscale 地址
    const response = await fetch(fullTargetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      redirect: 'follow',
    });

    // 转发响应给前端，保证样式/功能正常
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    // 异常兜底，方便排查问题
    return new Response(`代理失败：${(error as Error).message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
