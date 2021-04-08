const { CronJob } = require("cron");

const alpogoScraper = require("./alpogo-scraper");

console.log("Scheduler Started");
const fetchEventosEvento = new CronJob("0 2 * * *", async () => {
    console.log("Fetching nuevos eventos de AlPogo...");
    await alpogoScraper.run();
});

fetchEventosEvento.start();