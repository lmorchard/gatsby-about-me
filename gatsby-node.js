const fetch = require("node-fetch");

const {
  GITHUB_USERNAME,
  GLITCH_USERNAME,
  YOUTUBE_USERNAME,
  YOUTUBE_CHANNELID,
  YOUTUBE_KEY,
  TWITTER_USERNAME,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  SPOTIFY_USERNAME,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
  GOODREADS_USER_ID,
  GOODREADS_USER_NAME,
  GOODREADS_KEY,
  GOODREADS_SECRET,
  STEAM_USERNAME,
  STEAM_KEY,
  STEAM_STEAMID,
  STEAM_IGNORE_APP_IDS,
  TOOTS_NAME,
  TOOTS_BASE_URL,
  TOOTS_PROFILE_URL,
  TOOTS_OUTBOX_URL,
} = process.env;

exports.sourceNodes = async api => {
  await Promise.all([
    sourceNodesGithubEvents(api, { username: GITHUB_USERNAME }),
    sourceNodesGlitchUser(api, { login: GLITCH_USERNAME }),
    sourceNodesYoutubeChannelSearch(api, {
      username: YOUTUBE_USERNAME,
      channelId: YOUTUBE_CHANNELID,
      key: YOUTUBE_KEY,
    }),
    sourceNodesTwitter(api, {
      username: TWITTER_USERNAME,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token_key: TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
    }),
    sourceNodesSpotify(api, {
      username: SPOTIFY_USERNAME,
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      access_token: SPOTIFY_ACCESS_TOKEN,
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    sourceNodesGoodreads(api, {
      user_id: GOODREADS_USER_ID,
      user_name: GOODREADS_USER_NAME,
      key: GOODREADS_KEY,
      secret: GOODREADS_SECRET,
    }),
    sourceNodesSteam(api, {
      username: STEAM_USERNAME,
      key: STEAM_KEY,
      steamid: STEAM_STEAMID,
      ignoreAppids: STEAM_IGNORE_APP_IDS.split(" "),
    }),
    sourceNodesActivityPub(api, {
      name: TOOTS_NAME,
      baseUrl: TOOTS_BASE_URL,
      profileUrl: TOOTS_PROFILE_URL,
      outboxUrl: TOOTS_OUTBOX_URL,
    }),
  ]);
};

async function sourceNodesGithubEvents(
  { actions: { createNode }, createNodeId, createContentDigest },
  { username }
) {
  const events = await fetch(
    `https://api.github.com/users/${username}/events/public`
  ).then(res => res.json());

  createNode({
    username,
    events,
    id: createNodeId(`github-events-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `GithubEvents`,
      contentDigest: createContentDigest(events),
    },
  });
}

async function sourceNodesGlitchUser(
  { actions: { createNode }, createNodeId, createContentDigest },
  { login, baseUrl = "https://api.glitch.com" }
) {
  const fetchAPI = path => fetchJson(`${baseUrl}/${path}`);
  const userId = await fetchAPI(`userId/byLogin/${login}`);
  const user = await fetchAPI(`users/${userId}`);

  createNode({
    ...user,
    id: createNodeId(`glitch-user-${login}`),
    parent: null,
    children: [],
    internal: {
      type: `GlitchUser`,
      contentDigest: createContentDigest(user),
    },
  });
}

async function sourceNodesYoutubeChannelSearch(
  { actions: { createNode }, createNodeId, createContentDigest },
  { username, channelId, key }
) {
  const data = {
    username,
    channelId,
    ...(await fetchJson(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${key}`
    )),
  };
  createNode({
    ...data,
    id: createNodeId(`youtube-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `Youtube`,
      contentDigest: createContentDigest(data),
    },
  });
}

const Twitter = require("twitter");

async function sourceNodesTwitter(
  { actions: { createNode }, createNodeId, createContentDigest },
  config
) {
  const { username } = config;
  const client = new Twitter(config);
  const data = {
    username,
    timeline: await new Promise((resolve, reject) => {
      client.get(
        "statuses/user_timeline",
        { screen_name: username },
        (error, statuses, response) =>
          error ? reject(error) : resolve({ username, statuses })
      );
    }),
  };
  createNode({
    ...data,
    id: createNodeId(`twitter-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `Twitter`,
      contentDigest: createContentDigest(data),
    },
  });
}

const SpotifyWebApi = require("spotify-web-api-node");

async function sourceNodesSpotify(
  { actions: { createNode }, createNodeId, createContentDigest },
  config
) {
  const {
    username,
    clientId,
    clientSecret,
    access_token,
    refresh_token,
  } = config;

  const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });
  spotifyApi.setRefreshToken(refresh_token);
  spotifyApi.setAccessToken(access_token);

  const tokenResult = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(tokenResult.body["access_token"]);

  const meResult = await spotifyApi.getMe();
  const user = meResult.body;

  const tracksResult = await spotifyApi.getMyRecentlyPlayedTracks();
  const tracks = tracksResult.body.items;

  const nodeData = { username, user, tracks };

  createNode({
    ...nodeData,
    id: createNodeId(`spotify-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `Spotify`,
      contentDigest: createContentDigest(nodeData),
    },
  });
}

async function sourceNodesSteam(
  { actions: { createNode }, createNodeId, createContentDigest },
  config
) {
  const { key, steamid, username, ignoreAppids } = config;
  const [summary, recent, owned] = await Promise.all(
    [
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`,
      `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamid}`,
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamid}&include_appinfo=1&format=json`,
    ].map(fetchJson)
  );
  const nodeData = {
    username,
    steamid,
    ignoreAppids,
    user: summary.response.players[0],
    recent: recent.response.games,
    owned: owned.response.games,
  };
  createNode({
    ...nodeData,
    id: createNodeId(`steam-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `Steam`,
      contentDigest: createContentDigest(nodeData),
    },
  });
}

const xml2js = require("xml2js");
const { promisify } = require("util");
const parseString = promisify(xml2js.parseString);

async function sourceNodesGoodreads(
  { actions: { createNode }, createNodeId, createContentDigest },
  config
) {
  const { user_id, user_name: username, key } = config;
  const [user, reviews] = await Promise.all(
    [
      `https://www.goodreads.com/user/show/${user_id}.xml?key=${key}`,
      `https://www.goodreads.com/review/list/${user_id}.xml?key=${key}&v=2`,
    ].map(async url => {
      const res = await fetch(url);
      const xml = await res.text();
      const data = await parseString(xml);
      return data.GoodreadsResponse;
    })
  );

  const nodeData = {
    username: user.user[0].user_name[0],
    link: user.user[0].link[0],
    reviews: reviews.reviews[0].review.map(review => ({
      title: review.book[0].title[0],
      image_url: review.book[0].image_url[0],
      link: review.book[0].link[0],
    })),
  };

  createNode({
    ...nodeData,
    id: createNodeId(`goodreads-${username}`),
    parent: null,
    children: [],
    internal: {
      type: `Goodreads`,
      contentDigest: createContentDigest(nodeData),
    },
  });
}

async function sourceNodesActivityPub(
  { actions: { createNode }, createNodeId, createContentDigest },
  config
) {
  const { name, baseUrl, profileUrl, outboxUrl } = config;
  const outbox = await fetchJson(outboxUrl);

  outbox.orderedItems = await Promise.all(
    outbox.orderedItems.map(async item => {
      // HACK: Dereference retoots by fetching them
      if (item.type === "Announce") {
        item.objectUri = item.object;
        item.object = await fetchJson(item.object);
      }
      return { ...item };
    })
  );

  const nodeData = { name, baseUrl, profileUrl, outbox };

  createNode({
    ...nodeData,
    id: createNodeId(`activitypub-${name}`),
    parent: null,
    children: [],
    internal: {
      type: `ActivityPub`,
      contentDigest: createContentDigest(nodeData),
    },
  });
}

const fetchJson = url =>
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  }).then(res => res.json());
