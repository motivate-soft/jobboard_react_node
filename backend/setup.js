const nconf = require("nconf");
const httpsProxyAgent = require("https-proxy-agent");

require("./config");
const { secretKey } = nconf.get("stripe");
const products = require("./config/products.json");

let stripeConfig = {};

if (process.env.HTTPS_PROXY) {
  console.log("process.env.HTTPS_PROXY", process.env.HTTPS_PROXY);
  const agent = new httpsProxyAgent(`http://${process.env.HTTPS_PROXY}`);
  stripeConfig = { httpAgent: agent };
}
const stripe = require("stripe")(secretKey, stripeConfig);

async function deleteProducts() {
  const stripeProducts = await Promise.all(
    products.map(async (product) => {
      const deleted = await stripe.products.del(product.id);
      return deleted;
    })
  );
}

// Creates a collection of Stripe Products and SKUs to use in your storefront
async function createStoreProducts() {
  try {
    // deleteProducts();

    const stripeProducts = await Promise.all(
      products.map(async (product) => {
        const stripeProduct = await stripe.products.create({
          id: product.id,
          name: product.name,
        });

        const stripePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: product.price,
          currency: "usd",
          recurring: {
            interval: "month",
          },
        });

        return { stripeProduct, stripePrice };
      })
    );

    console.log("createStoreProducts", stripeProducts);
    console.log(
      `🛍️  Successfully created ${stripeProducts.length} products on your Stripe account.`
    );
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
  }
}

createStoreProducts();
