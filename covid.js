var request = require("request");
request("https://dekontaminasi.com/api/id/covid19/news/", function (
  error,
  response,
  body
) {
  var body = JSON.parse(body);
  var cases = body[0]["title"];
  console.log(cases);
});
