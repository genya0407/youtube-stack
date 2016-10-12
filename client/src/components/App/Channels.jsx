import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Player from './Player'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const channelsUrl = '/channels'

export default class Queue extends Component {
    componentDidMount () {
        this.setState({
            target_channel: null,
            new_channel_name: '',
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

    handleCreateChannel(name) {
        this.props.request.post(channelsUrl, { channel: { name } })
                  .then((response)=> {
                     this.setState({ new_channel_name: '' });
                     this.handleFetchChannels();
                  });
    }

    render() {
        let content = null;
        if (this.state !== null) {
            if (this.state.target_channel === null) {
                content = (
                    <Paper>
                        <List>
                            <ListItem disabled={true}>
                                <TextField
                                    floatingLabelText='channel name'
                                    onChange={(evt, value) => { this.setState({ new_channel_name: value }); }}
                                />
                                <RaisedButton label='Create' onClick={this.handleCreateChannel.bind(this, this.state.new_channel_name)} />
                            </ListItem>
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
