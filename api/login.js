export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    return res.status(200).json({
      success: true,
      token: 'emerald-token-123'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciais inválidas'
  });
}
