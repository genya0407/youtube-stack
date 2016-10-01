import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import YouTube from 'react-youtube';
import axios from 'axios';

const apiBaseUrl = 'http://localhost:8080';
const usersUrl = `/users`;
const signInUrl = `/auth/sign_in`;
const request = axios.create({ baseURL: apiBaseUrl });

export default class App extends Component {
    componentDidMount() {
        this.setState({
            user: null,
            identity: {
                email: "",
                password: "",
            },
        });
    }

    handleSignIn() {
        if (this.state.user == null) {
            request.post(signInUrl, this.state.identity)
                   .then((response) => {
                        ['access-token', 'token-type', 'client', 'expiry', 'uid'].forEach((headerName)=>{
                            request.defaults.headers.common[headerName] = response.headers[headerName];
                        });
                        this.setState({
                            user: response.data,
                        });
                    }).catch((error) => {
                        console.log(error);
                    })
        }
    }

    render() {
        console.log(this.state);
        return (
            <MuiThemeProvider>
                { this.state !== null && this.state.user === null &&
                    <Paper style={{ display: 'inline-block' }}>
                        <TextField
                            floatingLabelText='email'
                            onChange={(evt, value) => { this.setState({ identity: { email: value, password: this.state.identity.password } }) }}
                        /><br />
                        <TextField
                            floatingLabelText='password'
                            type='password'
                            onChange={(evt, value) => { this.setState({ identity: { email: this.state.identity.email, password: value } }) }}
                        />
                        <RaisedButton label='Sign In' onClick={() => { this.handleSignIn(); }} />
                    </Paper>
                }
            </MuiThemeProvider>
        );
    }
}
