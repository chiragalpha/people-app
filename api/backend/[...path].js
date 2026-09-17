export const config = {
  api: {
    bodyParser: false,
  },
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  const backend = process.env.BACKEND_URL || process.env.VITE_API_BASE_URL
  if (!backend) {
    res.status(500).json({ error: 'BACKEND_URL is not configured on Vercel.' })
    return
  }

  const slug = req.query.path
  const segments = Array.isArray(slug) ? slug.join('/') : (slug || '')
  const query = req.url?.includes('?') ? `?${req.url.split('?')[1]}` : ''
  const target = `${backend.replace(/\/$/, '')}/backend/${segments}${query}`

  const forwardHeaders = {}
  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase()
    if (lower === 'host' || lower === 'connection' || lower === 'content-length') continue
    if (value) forwardHeaders[key] = Array.isArray(value) ? value.join(', ') : value
  }

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req)

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body,
    })

    res.status(upstream.status)
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return
      res.setHeader(key, value)
    })

    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.send(buffer)
  } catch (error) {
    res.status(502).json({ error: error.message || 'Upstream request failed.' })
  }
}
