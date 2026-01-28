export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { message } = await req.json();

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '消息不能为空' });
  }

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer  $ {process.env.BAILIAN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen-plus-latest", // ←←←【重要】替换成你的模型名！
        input: {
          messages: [{ role: "user", content: message }]
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: '调用百炼失败，请检查配置' });
  }
}
