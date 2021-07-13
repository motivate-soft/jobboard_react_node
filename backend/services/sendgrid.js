const client = require("@sendgrid/client");
const nconf = require("nconf");
const logger = require("../helpers/logger");
require("../config");

const { apiKey, listId } = nconf.get("sendgrid");
client.setApiKey(apiKey);

exports.addEmailToList = async (email) => {
  const request = {
    method: "PUT",
    url: "/v3/marketing/contacts",
    body: {
      list_ids: [listId],
      contacts: [
        {
          email,
        },
      ],
    },
  };

  const res = await client.request(request);
  logger.info("service->sendgrid->addEmailToList->res");
  logger.info(res);
  
  //   client.request(request).then(([response, body]) => {
  //     console.log(response.statusCode);
  //     console.log(body);
  //   });
};
