import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

export default class Player extends Component {
    componentDidMount() {
        this.setState({
            channel: this.props.channel,
            playing_video: null,
            queue: [],
            player: null,
        })
        this.fetchQueue(this.props.channel);
        this.fetchPlayingVideo(this.props.channel);
    }

    componentWillUpdate() {
    }

    fetchQueue(channel=null) {
        if (channel === null){
            channel = this.state.channel.id
        }
        this.props.request.get(`/channels/${channel.id}/videos/queued`)
                          .then((response) => {
                               this.setState({ queue: response.data });
                          });
    }

    fetchPlayingVideo(channel=null) {
        if (channel === null){
            channel = this.state.channel.id
        }
        this.props.request.get(`/channels/${channel.id}/videos/playing`)
                          .then((response) => {
                               this.setState({ playing_video: response.data });
                               if (this.state.playing_video === null) {
                                   this.goNextVideo();
                               }
                          })
    }

    goNextVideo() {
        this.props.request.put(`/channels/${this.state.channel.id}/go_next`)
                          .then((response) => {
                               this.setState({ playing_video: response.data })
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
                </div>
            );

            queueContent = (
                <List>
                    {
                        this.state.queue.map((video) => {
                            return (
                                <ListItem primaryText={video.video_id} />
                            );
                        })
                    }
                </List>
            );
        }

        return (
            <Paper>
                {youtubeContent}
                {queueContent}
            </Paper>
        );
    }
}
