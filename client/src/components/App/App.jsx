import React, { Component } from 'react';
import YouTube from 'react-youtube';
import request from 'es6-request';

export default class App extends Component {
  /*
   * Component render()
   * see: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
   */
  componentDidMount() {
    this.goToNextVideo();
  }

  goToNextVideo() {
    request.get("http://localhost:4567/video/next")
           .perform().then();
  }

  render() {
    return (
      <YouTube
        videoId={this.state && this.state.videoId}
        onEnd={()=>{ this.goToNextVideo(); }}
        opts={{ playerVars: { autoplay: 1 } }}
      />
    );
  }
}
