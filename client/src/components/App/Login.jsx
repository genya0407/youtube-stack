import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

export default class Login extends Component {
    componentDidMount() {
        this.setState({
            email: "",
            password: "",
        });
    }

    render() {
        return (
            <Paper style={{ display: 'inline-block' }}>
                <TextField
                    floatingLabelText='email'
                    onChange={(evt, value) => { this.setState({ email: value }); }}
                /><br /><br />
                <TextField
                    floatingLabelText='password'
                    type='password'
                    onChange={(evt, value) => { this.setState({ password: value }); }}
                />
                <RaisedButton label='Sign In' onClick={() => { this.props.handleSignIn(this.state.email, this.state.password); }} />
            </Paper>
        );
    }
}
