import axios from "axios";
import cheerio from "cheerio";

const mystery = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZGUzYWEwNjgtM2VkNS00MTI2LTg5MDUtNjEyYTI5OTE4ZDlj%40thread.v2/0?context=%7b%22Tid%22%3a%22604f1a96-cbe8-43f8-abbf-f8eaf5d85730%22%2c%22Oid%22%3a%221d1aa04a-6287-4268-9f5c-a78ffa528b10%22%7d";

const article_data = [];

async function getarticles(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);

    const articles = $("article");
    articles.each(function () {
      var title = $(this).find("h2.teaser-title").text();
      var description = $(this).find("p.teaser-summary").text();
      var image = $(this).find("img").attr("src");

      article_data.push({ title, description, image });
    });

    /*const nextPageButton = $(".infinite-more-btn");
    if (nextPageButton.length > 0) {
      page = baseurl + nextPageButton.attr("href");
      await getarticles(page);
    }*/
  } catch (error) {
    console.error(error);
  }
}

getarticles(mystery)
  .then(() => {
    console.log(article_data);
  })
  .catch((error) => {
    console.error(error);
  });