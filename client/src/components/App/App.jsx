import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import axios from 'axios';

import Login from './Login';
import Channels from './Channels'

const apiBaseUrl = 'http://localhost:8080';
const signInUrl = '/auth/sign_in';
const request = axios.create({ baseURL: apiBaseUrl });

export default class App extends Component {
    componentDidMount() {
        this.setState({
            user: null,
        });
    }

    handleSignIn(email, password) {
        request.post(signInUrl, { email, password })
               .then((response) => {
                   ['access-token', 'token-type', 'client', 'expiry', 'uid'].forEach((headerName)=>{
                       request.defaults.headers.common[headerName] = response.headers[headerName];
                   });
                   this.setState({ user: response.data.data });
               }).catch((error) => {
                   console.log(error);
               })
    }

    render() {
        
        let content = null;
        if (this.state !== null) {
            if (this.state.user === null) { 
                content = (<Login handleSignIn={this.handleSignIn.bind(this)} />);
            } else {
                content = (<Channels request={request} user={this.state.user}/>)
            }
        }

        return (
            <MuiThemeProvider>
                {content}
            </MuiThemeProvider>
        );
    }
}
