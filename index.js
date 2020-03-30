const request = require("request");
const cheerio = require("cheerio");
const CSVToJson = require("csvtojson");
const JSONToCsv = require("json2csv").parse;
const FileSystem = require("fs");

function convert() {
  request(
    "https://www.exchangerates.org.uk/Dollars-to-South-African-Rands-currency-conversion-page.html",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(body);
        const exchange = $("#shd2a");
        let price = exchange.text();
        let date = new Date().toUTCString();

        CSVToJson()
          .fromFile("./source.csv")
          .then(source => {
            source.push({
              time: date,
              price: price
            });

            const csv = JSONToCsv(source, { fields: ["time", "price"] });

            FileSystem.writeFileSync("./source.csv", csv);
          });
      }
    }
  );
}

function post() {
  convert();
  setInterval(function() {
    convert();
  }, 300000);
}

post();
