const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.REACT_APP_NEWS_API_KEY);

function FactRetriever(props) {

  function getNewFact() {
    let rand = 1;
    let totalResults = 1;
    const TOPIC = props.topic;
    let fact;

    function randomNumberUpTo(max) {
      // Get a random number between 1 (inclusive) and max (inclusive)
      return Math.floor(Math.random() * (max)) + 1;
    }

    newsapi.v2.everything({
      // Figure out how many results are available for the chosen topic
      q: TOPIC,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 1
    }).then(response => {
      totalResults = response(["totalResults"]);
    });

    rand = randomNumberUpTo(totalResults)

    newsapi.v2.everything({
      // Retrieve a random article of the chosen topic
      q: TOPIC,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 1,
      page: rand
    }).then(response => {
      fact = response(["articles"][0])
    });

    return fact;
  }
  return
}

export default FactRetriever;
