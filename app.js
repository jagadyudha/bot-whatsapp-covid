const qrcode = require("qrcode-terminal");
const request = require("request");
const { Client } = require("whatsapp-web.js");
const fs = require("fs");
const SESSION_FILE_PATH = "./session.json";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  session: sessionData,
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (msg) => {
  if (msg.body === "/covid") {
    request(
      "https://coronavirus-19-api.herokuapp.com/countries/indonesia",
      function (error, response, body) {
        var body = JSON.parse(body);
        var cases = body["cases"];
        var deaths = body["deaths"];
        var recovered = body["recovered"];
        var active = body["active"];

        total =
          "Hallo berikut adalah perkembangan kasus covid-19 di Indonesia \n\n" +
          "🔴 Total Kasus : " +
          cases +
          "\n" +
          "🔴 Meninggal : " +
          deaths +
          "\n" +
          "🔴 Sembuh : " +
          recovered +
          "\n" +
          "🔴 Kasus Aktif : " +
          active +
          "\n\n" +
          "Tetap waspada dengan jaga jarak, gunakan masker, dan cuci tangan dengan sabun untuk memutus rantai penularan covid-19" +
          "\n\n" +
          "";
        msg.reply(total);
      }
    );
  }
});
