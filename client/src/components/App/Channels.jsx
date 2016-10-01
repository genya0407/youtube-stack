import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Player from './Player'

const channelsUrl = '/channels'

export default class Queue extends Component {
    componentDidMount () {
        this.setState({
            target_channel: null,
            channels: [],
        });
        this.handleFetchChannels();
    }

    handleFetchChannels() {
        this.props.request.get(channelsUrl)
                  .then((response) => {
                       this.setState({ channels: response.data });
                  })
    }

    render() {
        let content = null;
        if (this.state !== null) {
            if (this.state.target_channel === null) {
                content = (
                    <Paper>
                        <List>
                            {
                                this.state.channels.map((channel) => {
                                    return (
                                        <ListItem
                                            primaryText={channel.name}
                                            onClick={() => { this.setState({ target_channel: channel }) }}
                                        />
                                    )
                                })
                            }
                        </List>
                    </Paper>
                );
            } else {
                content = (
                    <Player
                        channel={this.state.target_channel}
                        request={this.props.request}
                        user={this.props.user}
                    />
                );
            }
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}
