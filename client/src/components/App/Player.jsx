import React, { Component } from 'react';
import YouTube from 'react-youtube';
import YoutubeAutocomplete from 'material-ui-youtube-autocomplete';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import {apiKey} from '../../config/secrets.js';

export default class Player extends Component {
    componentDidMount() {
        this.setState({
            channel: this.props.channel,
            playing_video: null,
            queue: [],
            player: null,
            search_results: [],
        })
        this.fetchQueue(this.props.channel.id);
        this.fetchPlayingVideo(this.props.channel.id);
    }

    componentWillUpdate() {
    }

    fetchQueue(channel_id=null) {
        if (channel_id === null) {
            channel_id = this.state.channel.id;
        }
        this.props.request.get(`/channels/${channel_id}/videos/queued`)
                          .then((response) => {
                               this.setState({ queue: response.data });
                          });
    }

    fetchPlayingVideo(channel_id=null) {
        if (channel_id === null) {
            channel_id = this.state.channel.id;
        }
        this.props.request.get(`/channels/${channel_id}/videos/playing`)
                          .then((response) => {
                               this.setState({ playing_video: response.data });
                               if (this.state.playing_video === null) {
                                   this.goNextVideo();
                               }
                          })
    }

    addVideo(video_id, title, thumbnail_url) {
        const channel_id = this.state.channel.id;
        this.props.request.post(`/channels/${channel_id}/videos/`, { video: { video_id, title, thumbnail_url } })
                          .then((response) => {
                              this.fetchQueue();
                          });
    }

    goNextVideo() {
        this.props.request.put(`/channels/${this.state.channel.id}/go_next`)
                          .then((response) => {
                              this.fetchPlayingVideo();
                              this.fetchQueue();
                          });
    }

    becomePlayer() {
        this.props.request.put(`/channels/${this.state.channel.id}/play`)
                          .then((response) => {
                               this.setState({ channel: response.data });
                               this.state.player.playVideo();
                          });
    }

    amIPlayer() {
        return (this.props.user.id === this.state.channel.player_id);
    }

    handleOnPlay(evt) {
        if (this.amIPlayer() === false) {
            evt.target.pauseVideo();
        }
    }

    updateVideo(id, params) {
        this.props.put(`/channels/${this.state.channel.id}/videos/${id}`, { video: params })
                  .then((response) => {
                      this.fetchPlayingVideo();
                  });
    }

    finishVideo() {
        const url = `/channels/${this.state.channel.id}/videos`;
        this.props.request.put(`${url}/${this.state.playing_video.id}`, { video: { state: 'played' } })
                          .then((response) => {
                              this.setState({ playing_video: null });
                          });
    }

    render() {
        let youtubeContent = null;
        let queueContent = null;
        let searchContent = null;

        if (this.state !== null) {
            youtubeContent = (
                <div>
                    <YouTube
                        videoId={this.state.playing_video !== null && this.state.playing_video.video_id}
                        onReady={(evt) => { this.setState({ player: evt.target }) }}
                        onPlay={(evt) => { this.handleOnPlay(evt); }}
                        onEnd={this.goNextVideo.bind(this)}
                        opts={{ playerVars: { autoplay: 1 } }}
                    />
                    {this.amIPlayer() === false &&
                        <RaisedButton label='become player' onClick={this.becomePlayer.bind(this)} />
                    }
                    <RaisedButton label='go next' onClick={this.goNextVideo.bind(this)} />
                </div>
            );

            searchContent = (
                <div>
                    <YoutubeAutocomplete
                        apiKey={apiKey}
                        maxResults={50}
                        placeHolder='Append Video'
                        callback={(videos) => { console.log(videos); this.setState({search_results: videos}) }}
                    />
                    {
                        this.state.search_results.map((video)=>{
                            return (
                                <Paper>
                                    <Avatar src={video.snippet.thumbnails.default.url} />
                                    {video.snippet.title}<br />
                                    <RaisedButton label='Add' onClick={this.addVideo.bind(this, video.id.videoId, video.snippet.title, video.snippet.thumbnails.default.url)} />
                                </Paper>
                            );
                        })
                    }
                </div>
            );

            queueContent = (
                <div>
                    {
                        this.state.queue.map((video) => {
                            return (
                                <Paper>
                                    <Avatar src={video.thumbnail_url} />
                                    {video.title}<br />
                                    { this.state.playing_video === null && 
                                        <RaisedButton
                                            label='Play'
                                            onClick={this.addVideo.bind(this, video.id, { state: 'playing' })}
                                        />
                                     }
                                </Paper>
                            );
                        })
                    }
                </div>
            );
        }

        return (
            <Paper>
                {youtubeContent}
                {queueContent}
                {searchContent}
            </Paper>
        );
    }
}
