const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const nconf = require("nconf");

const httpsProxyAgent = require("https-proxy-agent");
const agent = new httpsProxyAgent("http://172.25.1.2:3129");

require("../../config");
const { secretKey } = nconf.get("stripe");
const stripe = require("stripe")(secretKey);

async function createCustomer(company) {
  try {
    const { name, email, invoiceAddress, invoiceNotes } = company;

    let customer = await stripe.customers.create({
      name,
      email,
      address: invoiceAddress,
    });

    return customer;
  } catch (err) {
    winston.error("Stripe > createCustomer : Error" + err.message);
    throw err;
  }
}

function formatProducts(products) {
  products.forEach((product) => {
    /* Append additional display information */
    product.subheader = "subheader";
  });

  return products;
}

function sortAndFormatPlans(plans) {
  plans = plans.sort((a, b) => {
    /* Sort plans in ascending order of price (amount)
     * Ref: https://www.w3schools.com/js/js_array_sort.asp */
    return a.amount - b.amount;
  });

  plans.forEach((plan) => {
    /* Append additional display information */
    plan.formatted = JSON.stringify(plan);
    plan.features = "features";
    plan.highlight = "highlight";
  });
  logger.info("sortAndFormatPlans" + plans);

  return plans;
}

function attachPlansToProducts(plans, products) {
  products.forEach((product) => {
    const filteredPlans = plans.filter((plan) => {
      return product.id === plan.product;
    });

    product.plans = filteredPlans;
  });
  logger.info("attachPlansToProducts" + products);

  return products.filter((product) => product.plans.length > 0);
}

function getProductsAndPlans() {
  return Promise.all([
    stripe.products.list({}), // Default returns 10 products, sorted by most recent creation date
    stripe.plans.list({}), // Default returns 10 plans, sorted by most recent creation date
  ])
    .then((stripeData) => {
      var products = formatProducts(stripeData[0].data);
      var plans = sortAndFormatPlans(stripeData[1].data);

      logger.info("getProductsAndPlans->products" + products);
      logger.info("getProductsAndPlans->plans" + plans);

      return attachPlansToProducts(plans, products);
    })
    .catch((err) => {
      logger.error("Error fetching Stripe products and plans: ", err);
      return [];
    });
}

async function createCustomerAndSubscription(paymentMethodId, customerInfo) {
  /* Create customer and set default payment method */
  const customer = await stripe.customers.create({
    payment_method: paymentMethodId,
    email: customerInfo.email,
    name: customerInfo.name,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  /* Create subscription and expand the latest invoice's Payment Intent
   * We'll check this Payment Intent's status to determine if this payment needs SCA
   */
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        plan: customerInfo.planId,
      },
    ],
    // trial_from_plan: true,
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
}

module.exports = {
  createCustomer,
  formatProducts,
  sortAndFormatPlans,
  attachPlansToProducts,
  getProductsAndPlans,
  createCustomerAndSubscription,
};
