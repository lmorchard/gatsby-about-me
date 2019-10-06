const fetch = require("node-fetch");
const FeedParser = require("feedparser");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  { url: feedurl, name, parserOptions = {} }
) => {
  const { createNode } = actions;

  const startTime = Date.now();
  const feed = await fetchFeed({ feedurl, parserOptions });
  const duration = (Date.now() - startTime) / 1000.0;
  reporter.info(`Fetched feed ${name} - ${feedurl} - ${duration} s`);

  for (item of feed.items) {
    createNode({
      ...item,
      feedName: name,
      id: createNodeId(`feedparser-${item.guid}`),
      parent: null,
      children: [],
      internal: {
        type: `Feedparser`,
        contentDigest: createContentDigest(item),
      },
    });
  }
};

async function fetchFeed({ feedurl, parserOptions = {} }) {
  const res = await fetch(feedurl);
  return new Promise((resolve, reject) => {
    const feed = { meta: {}, items: [] };
    res.body
      .on("error", error => reject(error))
      .pipe(new FeedParser({ feedurl, ...parserOptions }))
      .on("error", error => reject(error))
      .on("meta", meta => (feed.meta = meta))
      .on("readable", function() {
        const stream = this;
        let item;
        while ((item = stream.read())) {
          feed.items.push(item);
        }
      })
      .on("end", () => resolve(feed));
  });
}
