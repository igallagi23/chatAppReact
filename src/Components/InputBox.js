import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import React, {useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import App from "../App";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles(() => ({
        textField: {
            width: '80%',
            marginLeft: '50px',
            marginTop:'2%'
        },
        inputContainer: {
            background: 'rgb(163,172,197,0.3)',
            height: '10%',
        },
        sendButton: {
            marginTop: '2.4%',
            marginLeft: '20px',
            background: 'rgb(107,122,163)',
            color: 'white'
        },
    }
));


export default function InputBox() {
    const [textBody, setTextBody] = useState('');
    const classes = useStyles();

    const sendMessage = async (event) => {
        try {
            event.preventDefault();
        } catch (e) {
            console.log('for enter test')
        }
        if (textBody.length === 0) {
            alert('Message can not be empty');
            return;
        }
        const body1 = JSON.stringify({
            userID: localStorage.getItem("userID"),
            username: localStorage.getItem("username"),
            content: textBody,
        });
        try {
            const response = await fetch(App.serverIp + '/post_message',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body1
                });
            if (response.ok === true) {
                setTextBody('');
            }
        } catch (e) {
            console.log(e);
            alert("error send message");
        }
    };
    const onKeyPress = async (e) => {
        if (e.which === 13) {
            await sendMessage(e);
        }
    };

    return (
        <Paper className={classes.inputContainer} elevation={0}>
            <TextField onKeyPress={onKeyPress} className={classes.textField} value={textBody}
                       onChange={(event => setTextBody(event.target.value))}/>
            <Button onClick={sendMessage} className={classes.sendButton}
                    endIcon={<Icon>send</Icon>}>
                Send
            </Button>
        </Paper>
    )

}