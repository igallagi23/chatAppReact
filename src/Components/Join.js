import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import App from '../App';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Join() {
    let history = useHistory();
    const classes = useStyles();
    const [username, setUsername] = useState('');

    const loginFunction = async (event) => {
        //if login fail try again
        if (username.length < 6 || !(username[0].toLowerCase() != username[0].toUpperCase())) {
            alert("Username Must be 6 letters, And must start with a letter!");
            setUsername('');
            return;
        }
        event.preventDefault();
        const body1 = JSON.stringify({
            username: username
        });
        try {
            const response = await fetch(App.serverIp + '/login',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body1
                });
            console.log(response);
            if (response.ok === true) {
                localStorage.setItem('username', username);
                const res = (await response.json()).body;
                localStorage.setItem('userID', res.user_id);
                history.push('/chat', {username: username});
            }
            //if user taken alert and suggest same username + rand num
            if (response.status === 409) {
                alert("Username Exist,Please choose another one");
                setUsername(username + (Math.floor(Math.random() * 100)).toString());
            }
        } catch (e) {
            console.log(e);
            alert("Server Error");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <form className={classes.form} noValidate onSubmit={loginFunction}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="Username"
                        label="Username"
                        name="Username"
                        autoComplete="Username"
                        onChange={(event => setUsername(event.target.value))}
                        value={username}
                        autoFocus
                    />
                    <Alert severity="info">Username Must be 6 letters, And must start with a letter</Alert>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Log In
                    </Button>
                </form>
            </div>
            <Box mt={8}>
            </Box>
        </Container>
    );
}