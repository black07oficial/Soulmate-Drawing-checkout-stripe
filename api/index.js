const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51R7hjAEt83JyliblOKDecneD2IAJYAeG8u5X1AzSf7kInh2A36xsQHSKQ3MaILLIpaUrWpI2MtIIG4SbP0vCUA1A00YWP175ZR');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Soulmate Drawing',
              description: 'Your personalized soulmate drawing'
            },
            unit_amount: 1000, // $10.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro no Stripe:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
