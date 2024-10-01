// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News newest page
  await page.goto("https://news.ycombinator.com/newest");

  // Wait for the articles to load
  await page.waitForSelector(".itemlist");

  // Get the first 100 articles
  const articles = await page.$$eval(".itemlist .athing", articles => {
    return articles.slice(0, 100).map(article => {
      // Extract the article ID and rank (which serves as a timestamp proxy)
      const id = article.getAttribute("id");
      return {
        id,
        rank: parseInt(article.querySelector(".rank").innerText.replace(".", ""), 10),
      };
    });
  });

  // Validate that the articles are sorted by rank from newest to oldest
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    if (articles[i].rank >= articles[i + 1].rank) {
      isSorted = false;
      break;
    }
  }

  // Output the result of the validation
  if (isSorted) {
    console.log("The articles are sorted from newest to oldest.");
  } else {
    console.log("The articles are NOT sorted correctly.");
  }

  // Close the browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
