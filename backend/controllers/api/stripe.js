const httpsProxyAgent = require("https-proxy-agent");
const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const nconf = require("nconf");
const products = require("../../config/products.json");

require("../../config");
const { secretKey } = nconf.get("stripe");

let stripeConfig = {};

if (process.env.HTTPS_PROXY) {
  const agent = new httpsProxyAgent(`http://${process.env.HTTPS_PROXY}`);
  stripeConfig = { httpAgent: agent };
}
const stripe = require("stripe")(secretKey, stripeConfig);

function getDiscountRate(size) {
  if (size === 1) {
    return 0;
  } else if (size <= 5) {
    return 5;
  } else if (size <= 10) {
    return 10;
  } else if (size <= 15) {
    return 15;
  } else if (size <= 30) {
    return 20;
  } else if (size <= 40) {
    return 25;
  } else if (size <= 50) {
    return 30;
  } else if (size <= 60) {
    return 35;
  } else if (size <= 75) {
    return 40;
  } else if (size <= 99) {
    return 45;
  } else {
    return 50;
  }
}

function calculatePricePerPost(bundleState) {
  let pricePerPost = products[0].price;
  if (bundleState.showLogo) {
    pricePerPost += products[1].price;
  }
  if (bundleState.blastEmail) {
    pricePerPost += products[2].price;
  }
  if (bundleState.highlight) {
    pricePerPost += products[3].price;
  }
  if (bundleState.highlightColor) {
    pricePerPost += products[4].price;
  }
  if (bundleState.stickyDuration) {
    switch (bundleState.stickyDuration) {
      case "day":
        pricePerPost += products[5].price;
        break;
      case "week":
        pricePerPost += products[6].price;
        break;
      case "month":
        pricePerPost += products[7].price;
        break;
      default:
        break;
    }
  }

  return pricePerPost;
}

function calculateBundlePrice(bundleState, size) {
  let pricePerPost = calculatePricePerPost(bundleState);
  return pricePerPost * size * (1 - getDiscountRate(size) / 100);
}

async function getPriceItems(productIds) {
  let productsWithPrice = await getProductsAndPlans();
  let pricingItems = [];

  productIds.map((productId) => {
    let filteredProducts = productsWithPrice.filter(
      (product) => product.id === productId
    );
    let priceId = filteredProducts[0].prices[0].id;
    pricingItems.push(priceId);
  });
  return pricingItems;
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

function attachPlansToProducts(plans, products, prices) {
  products.forEach((product) => {
    const filteredPlans = plans.filter((plan) => {
      return product.id === plan.product;
    });

    const filteredPrices = prices.filter((price) => {
      return product.id === price.product;
    });

    product.plans = filteredPlans;
    product.prices = filteredPrices;
  });

  return products.filter((product) => product.plans.length > 0);
}

async function getProductsAndPlans() {
  try {
    const stripeData = await Promise.all([
      stripe.products.list({}), // Default returns 10 products, sorted by most recent creation date
      stripe.plans.list({}), // Default returns 10 plans, sorted by most recent creation date
      stripe.prices.list({}), // Default returns 10 plans, sorted by most recent creation date
    ]);
    var products = formatProducts(stripeData[0].data);
    var plans = sortAndFormatPlans(stripeData[1].data);
    var prices = stripeData[2].data;

    logger.info("getProductsAndPlans->products");
    logger.info(products);
    logger.info("getProductsAndPlans->plans");
    logger.info(plans);

    return attachPlansToProducts(plans, products, prices);
  } catch (error) {
    logger.error("Error fetching Stripe products and plans: ", err);
    return [];
  }
}

async function createCoupon(discountPercent, maxRedemptions) {
  console.log("createCoupon->params", discountPercent, maxRedemptions);
  const coupon = await stripe.coupons.create({
    duration: "forever",
    // duration: "repeating",
    percent_off: discountPercent,
    max_redemptions: maxRedemptions,
    applies_to: {
      products: products.map((product) => product.id),
    },
  });
  return coupon;
}

async function createPromoCode(req, res) {
  try {
    const { size } = req.body;
    let coupon = await createCoupon(getDiscountRate(size), size);
    logger.info("createPromoCode->coupon", coupon);
    const promotion_code = await stripe.promotionCodes.create({
      coupon: coupon.id,
      // customer: 'cus_4fdAW5ftNQow1a',
      max_redemptions: size,
    });
    logger.info("createPromoCode->promotion_code", promotion_code);

    return res.status(200).send({
      promoCode: promotion_code.code,
    });
  } catch (error) {
    logger.error(error);
    return handleError(
      res,
      req,
      500,
      error.raw.message || "failed to create promotion code",
      error.raw.type || "serverError"
    );
  }
}

async function createPaymentIntent(req, res) {
  try {
    const { size, ...upsells } = req.body;
    let amount = calculateBundlePrice(upsells, size);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    return res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.error(error);
    return handleError(
      res,
      req,
      500,
      error.raw.message || "failed to create payment intent",
      error.raw.type || "serverError"
    );
  }
}

async function createCustomerAndSubscription(req, res) {
  try {
    console.log("createCustomerAndSubscription", req.body);
    const { company, job, promoCode, paymentMethodId } = req.body;
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: company.email,
      // name: company.name,
      // address: company.invoiceAddress,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    console.log("createCustomerAndSubscription->customer", customer);

    let productIds = [
      "showLogo",
      "blastEmail",
      "highlight",
      "highlightColor",
    ].filter((field) => job[field] === true);
    productIds.push("jobPosting");
    if (job.stickyDuration) {
      switch (job.stickyDuration) {
        case "day":
          productIds.push("stickyDay");
          break;
        case "week":
          productIds.push("stickyWeek");
          break;
        case "month":
          productIds.push("stickyMonth");
          break;
        default:
          break;
      }
    }

    let pricingItems = await getPriceItems(productIds);
    console.log("createCustomerAndSubscription->pricingItems", pricingItems);

    // get promotion_code
    const { data } = await stripe.promotionCodes.list({
      code: promoCode,
    });

    if (data.length === 0) {
      let error = new Error();
      error = {
        code: 400,
        message: "invalid promotion code",
      };
      throw error;
    }
    let promotion_code = data[0].id;
    console.log("createCustomerAndSubscription->promotionCodes", data);

    /* Create subscription and expand the latest invoice's Payment Intent
     * We'll check this Payment Intent's status to determine if this payment needs SCA
     */

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: pricingItems.map((item) => ({
        price: item,
      })),
      trial_from_plan: true,
      expand: ["latest_invoice.payment_intent"],
      promotion_code,
    });
    console.log("createCustomerAndSubscription->subscription", subscription);

    return res.status(200).send({
      subscription,
    });
  } catch (error) {
    console.log("error", error);
    return handleError(
      res,
      req,
      error.code || 500,
      error.message || "failed to create subscription",
      error.type || "serverError"
    );
  }
}

module.exports = {
  createPaymentIntent,
  createPromoCode,
  createCustomerAndSubscription,
};
