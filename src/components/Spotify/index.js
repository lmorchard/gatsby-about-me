import React from "react";

import { graphql } from "gatsby";

import Card from "../Card";
import "./index.scss";

export default class extends React.Component {
  render() {
    const { username, user, tracks } = this.props;
    const maxItems = this.props.maxItems || 10;

    return (
      <Card className="spotify" {...this.props}>
        <h3>
          Spotify (
          <a rel="me" href={user.external_urls.spotify} title={username}>
            {user.display_name}
          </a>
          )
        </h3>
        <section>
          <ul>
            {tracks
              .slice(0, maxItems)
              .map((item, idx) => this.renderItem(item, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderItem(item, idx) {
    const { played_at } = item;
    const { track } = item;
    const { album, artists } = track;
    const image = album.images.filter(i => i.width === 64)[0];
    return (
      <li key={idx} className="item">
        <a href={track.external_urls.spotify} className="cover">
          {image ? <img src={image.url} alt={track.name} /> : " "}
        </a>
        <span className="track">
          "
          <a href={track.external_urls.spotify} className="name">
            {track.name}
          </a>
          "{" on "}
          <a href={album.external_urls.spotify} className="album">
            {album.name}
          </a>
          {" by "}
          {artists.map((artist, idx) => [
            <a key={idx} href={artist.external_urls.spotify} className="artist">
              {artist.name}
            </a>,
            idx < artists.length - 1 ? ", " : "",
          ])}
          <span className="playedAt" title={played_at} dateTime={played_at}>
            {played_at}
          </span>
        </span>
        <span className="preview">
          <audio src={track.preview_url} controls preload="none" />
        </span>
      </li>
    );
  }
}

export const fragmentQuery = graphql`
  fragment spotifyActivity on Spotify {
    username
    tracks {
      played_at
      track {
        name
        album {
          external_urls {
            spotify
          }
          name
          images {
            url
            width
          }
        }
        artists {
          external_urls {
            spotify
          }
          name
        }
        external_urls {
          spotify
        }
        preview_url
      }
    }
    user {
      external_urls {
        spotify
      }
      display_name
    }
  }
`;
