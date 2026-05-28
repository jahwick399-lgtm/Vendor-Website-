require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const PORT = process.env.PORT || 10000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ─── Stripe Price IDs ──────────────────────────────────────────────────────────
const PRICE_IDS = {
  electronics: process.env.STRIPE_PRICE_ELECTRONICS,
  shoes:       process.env.STRIPE_PRICE_SHOES,
  jewelry:     process.env.STRIPE_PRICE_JEWELRY,
  hoodies:     process.env.STRIPE_PRICE_HOODIES,
  fragrance:   process.env.STRIPE_PRICE_FRAGRANCE,
  watches:     process.env.STRIPE_PRICE_WATCHES,
  clothing:    process.env.STRIPE_PRICE_CLOTHING,
  bundle:      process.env.STRIPE_PRICE_BUNDLE,
}

// ─── Vendor Content ─────────────────────────────────────────────────────────────
// This is what buyers see AFTER payment. Only returned after Stripe session verified.
// To add more links: paste the URL in the `url` field for each item.
const VENDOR_CONTENT = {

  electronics: {
    title: '📱 Electronics Vendor',
    intro: 'Direct supplier links. Buy at these prices, resell for 2–5x on eBay, Facebook, Offerup.',
    sections: [
      {
        name: '📱 Phones',
        items: [
          { name: 'iPhone',         price: '$10',  url: 'https://usfans.com/product/3/7722115604?ref=KRYFUS' },
          { name: 'iPhone',         price: '$14',  url: 'https://usfans.com/product/3/7719050755?ref=KRYFUS' },
          { name: 'iPhone 16 Plus', price: '$208', url: 'https://usfans.com/product/3/7722052392?ref=KRYFUS' },
          { name: 'Samsung S25',    price: '$148', url: 'https://usfans.com/product/3/7722046568?ref=KRYFUS' },
          { name: 'Samsung S24',    price: '$148', url: 'https://usfans.com/product/3/7722015174?ref=KRYFUS' },
        ],
      },
      {
        name: '🎧 Earbuds & Headphones',
        items: [
          { name: 'AirPods',               price: '$41',  url: 'https://usfans.com/product/3/7722078124?ref=KRYFUS' },
          { name: 'AirPods (alt)',          price: '$215', url: 'https://usfans.com/product/3/7722115612?ref=KRYFUS' },
          { name: 'Wired Earphones',        price: '$7',   url: 'https://usfans.com/product/3/7719121715?ref=KRYFUS' },
          { name: 'Max Earphones',          price: '$72',  url: 'https://usfans.com/product/3/7719064363?ref=KRYFUS' },
          { name: 'Bose Ultra Open Earbuds',price: '$22',  url: 'https://usfans.com/product/3/7722046570?ref=KRYFUS' },
          { name: 'Samsung Buds 3 Pro',     price: '$20',  url: 'https://usfans.com/product/3/7722099768?ref=KRYFUS' },
          { name: 'Samsung Buds 2 Pro',     price: '$26',  url: 'https://usfans.com/product/3/7721997398?ref=KRYFUS' },
        ],
      },
      {
        name: '🔊 Speakers',
        items: [
          { name: 'JBL Flip 5',  price: '$21', url: 'https://usfans.com/product/3/7718977567?ref=KRYFUS' },
          { name: 'JBL Flip 6',  price: '$24', url: 'https://usfans.com/product/3/7719109765?ref=KRYFUS' },
          { name: 'JBL Pulse',   price: '$24', url: 'https://usfans.com/product/3/7722085972?ref=KRYFUS' },
          { name: 'JBL Pulse 6', price: '$37', url: 'https://usfans.com/product/3/7722089886?ref=KRYFUS' },
          { name: 'Bose BFlex',  price: '$40', url: 'https://usfans.com/product/3/7719052691?ref=KRYFUS' },
        ],
      },
      {
        name: '💈 Dyson & Grooming',
        items: [
          { name: 'Dyson HD 16',               price: '$120', url: 'https://usfans.com/product/3/7721989378?ref=KRYFUS' },
          { name: 'Dyson HD 15',               price: '$118', url: 'https://usfans.com/product/3/7722044614?ref=KRYFUS' },
          { name: 'Dyson HD 08',               price: '$34',  url: 'https://usfans.com/product/3/7719052693?ref=KRYFUS' },
          { name: 'Dyson HD 07',               price: '$92',  url: 'https://usfans.com/product/3/7722036980?ref=KRYFUS' },
          { name: 'Dyson HT 01',               price: '$92',  url: 'https://usfans.com/product/3/7719091943?ref=KRYFUS' },
          { name: 'Dyson 03',                  price: '$92',  url: 'https://usfans.com/product/3/7722097826?ref=KRYFUS' },
          { name: 'Dyson Baby Electric Clippers',price:'$110', url: 'https://usfans.com/product/3/7719013277?ref=KRYFUS' },
          { name: 'Dyson Comb',                price: '$31',  url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
        ],
      },
      {
        name: '📱 Phone Cases & Accessories',
        items: [
          { name: 'Phone Case', price: '$8',  url: 'https://usfans.com/product/3/7719076199?ref=KRYFUS' },
          { name: 'Phone Case', price: '$8',  url: 'https://usfans.com/product/3/7719121721?ref=KRYFUS' },
          { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7722078136?ref=KRYFUS' },
          { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7740212963?ref=KRYFUS' },
          { name: 'Phone Case', price: '$31', url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
        ],
      },
    ],
  },

  shoes: {
    title: '👟 Shoes Vendor',
    intro: 'Supplier access for sneakers and designer footwear. Open each link and message the seller directly.',
    sections: [
      {
        name: '👟 Sneakers & Designer Shoes',
        // ── ADD YOUR SHOE SUPPLIER LINKS HERE ──
        // To get these: open your Google Sheet → right-click each "CLICK ME" cell → Edit Link → copy the URL
        items: [
          { name: 'Yeezys',                  price: '$15',  url: 'ADD_LINK_HERE' },
          { name: 'Jordan 3',                price: '$31',  url: 'ADD_LINK_HERE' },
          { name: 'Jordan 4',                price: '$100', url: 'ADD_LINK_HERE' },
          { name: 'Air Force 1s',            price: '$38',  url: 'ADD_LINK_HERE' },
          { name: 'Panda Dunks',             price: '$10',  url: 'ADD_LINK_HERE' },
          { name: 'Chunky Dunky\'s',         price: '$40',  url: 'ADD_LINK_HERE' },
          { name: 'Yeezy 350 Boost',         price: '$53',  url: 'ADD_LINK_HERE' },
          { name: 'Balenciaga Track Runners', price: '$178', url: 'ADD_LINK_HERE' },
          { name: 'Balenciaga Sock',         price: '$26',  url: 'ADD_LINK_HERE' },
          { name: 'Balenciaga Fuzzy Slide',  price: '$23',  url: 'ADD_LINK_HERE' },
          { name: 'Gucci Slides',            price: '$24',  url: 'ADD_LINK_HERE' },
          { name: 'Bapesta',                 price: '$63',  url: 'ADD_LINK_HERE' },
          { name: 'LV Trainer',              price: '$26',  url: 'ADD_LINK_HERE' },
          { name: 'Lanvin Curb',             price: '$123', url: 'ADD_LINK_HERE' },
          { name: 'Mason Mihara',            price: '$40',  url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  jewelry: {
    title: '💎 Jewelry Vendor',
    intro: 'High-margin jewelry at supplier pricing. Flip for 5–10x on Depop, Instagram, and local.',
    sections: [
      {
        name: '💎 Jewelry Supplier',
        items: [
          { name: 'Full Jewelry Catalog — Browse All Products', price: null, url: 'https://jewelryresell.com' },
        ],
      },
      {
        name: '🔗 Additional Jewelry Links',
        // ── ADD MORE JEWELRY LINKS FROM YOUR SPREADSHEETS HERE ──
        items: [
          { name: 'LV Slim Bracelet',    price: '$35', url: 'ADD_LINK_HERE' },
          { name: 'Vancleef Bracelet',   price: '$15', url: 'ADD_LINK_HERE' },
          { name: 'Vancleef Necklace',   price: '$9',  url: 'ADD_LINK_HERE' },
          { name: 'Punchmade Dev Chain', price: '$58', url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  hoodies: {
    title: '🧥 Hoodie Vendor',
    intro: 'Designer hoodies at supplier cost. Top-selling resell category on every platform.',
    sections: [
      {
        name: '🧥 Hoodies & Sweatshirts',
        // ── ADD YOUR HOODIE SUPPLIER LINKS HERE ──
        items: [
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'ADD_LINK_HERE' },
          { name: 'Chrome Hearts Hoodie',  price: '$45', url: 'ADD_LINK_HERE' },
          { name: 'Hellstar Hoodies',      price: '$25', url: 'ADD_LINK_HERE' },
          { name: 'Bape Hoodie',           price: '$45', url: 'ADD_LINK_HERE' },
          { name: 'Essentials Hoodies',    price: '$30', url: 'ADD_LINK_HERE' },
          { name: 'Denim Tier',            price: '$50', url: 'ADD_LINK_HERE' },
          { name: 'North Face Puffer',     price: '$52', url: 'ADD_LINK_HERE' },
          { name: 'Moncler Puffer',        price: '$50', url: 'ADD_LINK_HERE' },
          { name: 'Trapstar',              price: '$40', url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  fragrance: {
    title: '🌸 Fragrance Vendor',
    intro: 'Designer colognes and perfumes at supplier pricing. Easy flip, high demand year-round.',
    sections: [
      {
        name: '🌸 Cologne & Perfume',
        // ── ADD YOUR FRAGRANCE SUPPLIER LINKS HERE ──
        items: [
          { name: 'Creed Cologne',                         price: '$38', url: 'ADD_LINK_HERE' },
          { name: 'Baccarat Rouge',                        price: '$40', url: 'ADD_LINK_HERE' },
          { name: 'Versace Eros',                          price: '$10', url: 'ADD_LINK_HERE' },
          { name: 'Bleu de Chanel',                        price: '$20', url: 'ADD_LINK_HERE' },
          { name: 'Valentino',                             price: '$20', url: 'ADD_LINK_HERE' },
          { name: '1 Million Cologne',                     price: '$10', url: 'ADD_LINK_HERE' },
          { name: 'Jean Paul Gaultier Le Male EDP',        price: '$10', url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  watches: {
    title: '⌚ Watches Vendor',
    intro: 'Watches at supplier pricing. Smart watches flip fast on eBay, Depop, and Facebook.',
    sections: [
      {
        name: '⌚ Smart Watches',
        items: [
          { name: 'Smart Watch',  price: '$7',  url: 'https://usfans.com/product/3/7722023114?ref=KRYFUS' },
          { name: 'Smart Watch',  price: '$31', url: 'https://usfans.com/product/3/7719017201?ref=KRYFUS' },
          { name: 'Smart Watch',  price: '$41', url: 'https://usfans.com/product/3/7719107821?ref=KRYFUS' },
        ],
      },
      {
        name: '🕰 Luxury Watches',
        // ── ADD YOUR LUXURY WATCH SUPPLIER LINKS HERE ──
        items: [
          { name: 'Rolex', price: '$75', url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  clothing: {
    title: '👕 Clothing Vendor',
    intro: 'Streetwear and designer clothing at supplier pricing. Consistent sellers every season.',
    sections: [
      {
        name: '👕 T-Shirts & Tops',
        // ── ADD YOUR CLOTHING SUPPLIER LINKS HERE ──
        items: [
          { name: 'Chrome Hearts T-Shirt', price: '$21', url: 'ADD_LINK_HERE' },
          { name: 'Hellstar T-Shirt',      price: '$35', url: 'ADD_LINK_HERE' },
          { name: 'Bape T-Shirt',          price: '$40', url: 'ADD_LINK_HERE' },
          { name: 'Essentials T-Shirts',   price: '$35', url: 'ADD_LINK_HERE' },
          { name: 'Alo',                   price: '$80', url: 'ADD_LINK_HERE' },
        ],
      },
      {
        name: '👖 Pants & Bottoms',
        items: [
          { name: 'EE Shorts',              price: '$20', url: 'ADD_LINK_HERE' },
          { name: 'Purple Jeans',           price: '$60', url: 'ADD_LINK_HERE' },
          { name: 'Amiri Jeans',            price: '$50', url: 'ADD_LINK_HERE' },
          { name: 'Gallery Dept. Sweatpants',price: '$40', url: 'ADD_LINK_HERE' },
          { name: 'Nike Tech Fleece',       price: '$55', url: 'ADD_LINK_HERE' },
        ],
      },
      {
        name: '🎒 Bags & Accessories',
        items: [
          { name: 'LV Messenger Bag',   price: '$21',  url: 'ADD_LINK_HERE' },
          { name: 'LV Backpack',        price: '$131', url: 'ADD_LINK_HERE' },
          { name: 'LV Backpack (alt)',   price: '$105', url: 'ADD_LINK_HERE' },
          { name: 'Supreme Backpack',   price: '$26',  url: 'ADD_LINK_HERE' },
          { name: 'Goyard Wallet',      price: '$14',  url: 'ADD_LINK_HERE' },
          { name: 'Bottega Veneta',     price: '$108', url: 'ADD_LINK_HERE' },
          { name: 'Prada Sunglasses',   price: '$10',  url: 'ADD_LINK_HERE' },
        ],
      },
    ],
  },

  // Bundle returns all vendor content combined
  bundle: null,
}

// Build bundle content from all vendors
VENDOR_CONTENT.bundle = {
  title: '🔥 All Access Bundle',
  intro: 'You have access to every vendor. All 7 categories below.',
  sections: Object.entries(VENDOR_CONTENT)
    .filter(([key, val]) => key !== 'bundle' && val)
    .flatMap(([, vendor]) =>
      vendor.sections.map(s => ({ ...s, name: `${vendor.title.split(' ')[0]} ${s.name}` }))
    ),
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (_origin, cb) => cb(null, true),
  credentials: true,
}))
app.options('*', cors())

// ─── Webhook (raw body — must be before express.json) ─────────────────────────
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[Webhook] Bad signature:', err.message)
    return res.status(400).json({ error: err.message })
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    console.log(`[Webhook] Paid — session=${s.id} vendor=${s.metadata?.vendorId} email=${s.customer_details?.email}`)
  }
  res.json({ received: true })
})

app.use(express.json())

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/',          (_req, res) => res.json({ status: 'Vendors API running' }))
app.get('/api/health',(_req, res) => res.json({ status: 'ok' }))

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { vendorId } = req.body
    const priceId = PRICE_IDS[vendorId]
    if (!priceId) {
      return res.status(400).json({ error: `No price configured for: ${vendorId}. Add it to Render env vars.` })
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/?canceled=true`,
      allow_promotion_codes: true,
      metadata: { vendorId },
    })
    console.log(`[Checkout] Created — vendor=${vendorId} session=${session.id}`)
    res.json({ url: session.url })
  } catch (err) {
    console.error('[Checkout]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Verify session + return vendor content
app.get('/api/verify-session', async (req, res) => {
  try {
    const { session_id } = req.query
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' })

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const paid = session.payment_status === 'paid'

    if (!paid) return res.json({ paid: false })

    const vendorId = session.metadata?.vendorId
    const content  = VENDOR_CONTENT[vendorId] || null

    res.json({
      paid:    true,
      email:   session.customer_details?.email || null,
      vendorId,
      content,
    })
  } catch (err) {
    console.error('[Verify]', err.message)
    res.status(400).json({ error: err.message })
  }
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`[Server] Port ${PORT} | Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗ MISSING'}`)
})
