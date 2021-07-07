const client = require("@sendgrid/client");
const nconf = require("nconf");
const logger = require("../helpers/logger");
require("../config");

const { apiKey, listId } = nconf.get("sendgrid");
client.setApiKey(apiKey);

exports.addToContact = async (email) => {
  try {
    const request = {
      method: "PUT",
      url: "/v3/marketing/contacts",
      body: {
        list_ids: [listId],
        contacts: [
          {
            // email: "example@email.com",
            email,
          },
        ],
      },
    };

    const res = await client.request(request);
    logger.info("service->sendgrid->res");
    logger.info(res);
  } catch (error) {
    logger.error(error);
  }

  //   client.request(request).then(([response, body]) => {
  //     console.log(response.statusCode);
  //     console.log(body);
  //   });
};
