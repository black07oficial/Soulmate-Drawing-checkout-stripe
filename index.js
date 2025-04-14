// Carrega a biblioteca do Stripe com sua chave secreta do .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // 🔓 Libera o domínio do seu frontend para acessar a API
  res.setHeader('Access-Control-Allow-Origin', 'https://soulmate-drawing.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Trata requisições OPTIONS (preflight do navegador)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ❌ Rejeita métodos diferentes de POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // 💳 Cria o PaymentIntent com valor e moeda
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // R$ 50,00 (em centavos)
      currency: 'brl',
      payment_method_types: ['card'],
    });

    // ✅ Retorna o clientSecret para o frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {// ⚠️ Se der erro, retorna o erro
    res.status(500).json({ error: error.message });
  }
};
