import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import App from "../App";

const useStyles = makeStyles(() => ({
        messagesList: {
            overflow: 'auto',
            maxHeight: '88%',
        },

        userMessages: {
            width: '60%',
            height: '1%',
            background: 'rgb(163,172,197)',
            justify: "flex-end",
            float: 'right',
            display: 'flex',
            flex: 1
        },
        otherMessages: {
            background: 'rgb(246,246,246)',
            width: '60%',
            height: '1%'
        },

        otherAvatar: {
            background: 'rgb(163,172,197)',
            float: 'left',
            height: '5%',
            width: '5%',
            marginRight: '5px'
        },
        userAvatar: {
            background: 'rgb(246,246,246)',
            color: 'rgb(163,172,197)',
            float: 'left',
            height: '7%',
            width: '7%',
            marginRight: '5px',
        }
    }
));


export default function MessageComponent() {
    const [messages, setMessages] = useState([]);
    const classes = useStyles();
    const messagesEndRef = useRef(null);
    const lastMessageDate = new Date();

    //scroll down when new message pops
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    };
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        (async function fetchMessagesOnConnect() {
            try {
                const response = await fetch(App.serverIp + '/get_last_messages',
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'GET',
                    });

                if (response.ok === true) {
                    let messagesList = await response.json();
                    // let datetest = new Date(messagesList.body[0].createdAt);
                    // console.log(datetest.toISOString().split('T')[1].split('.')[0]);
                    setMessages(messagesList.body.reverse());
                    let lastM = messagesList.body[messagesList.body.length - 1];
                    let date = new Date(lastM.createdAt);
                    lastMessageDate.setTime(date);
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            (async function fetchNewMessages() {
                try {
                    let link = App.serverIp + '/get_new_messages?date=' + lastMessageDate;
                    const response = await fetch(link,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'GET',
                        });

                    if (response.ok === true) {
                        let new_messages = await response.json();
                        let new_m_body = new_messages.body;
                        if (new_m_body.length > 0) {
                            new_messages.body.forEach(message => {
                                setMessages(messages => [...messages, message]);

                                let date = new Date(message.createdAt);
                                date.setMilliseconds(date.getMilliseconds() + 100);
                                lastMessageDate.setTime(date);
                                lastMessageDate.setSeconds(date.getSeconds());
                                console.log(lastMessageDate);
                            });
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }, 500);
        return () => clearInterval(intervalId); //This is important
    }, []);

    const dateToTimeStringConverter= (date)=>{
        let dateTest=new Date(date);
        return (dateTest.toISOString().split('T')[1].split('.')[0]);
    };

    return (
        <List className={classes.messagesList}>
            {messages.map((message) => (
                message.user_id == localStorage.getItem("userID") ?
                    (
                        <ListItem style={{width: '80%', float: 'right'}} key={message.message_id}>
                            {/*text align works only like this for me.*/}
                            <Card className={classes.userMessages}>
                                <CardActionArea>

                                    <CardContent>
                                        <Avatar
                                            className={classes.userAvatar}>{message.username[0].toLocaleUpperCase()}</Avatar>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {message.username}
                                        </Typography>

                                        <Typography style={{marginTop: '15px'}} gutterBottom variant="h8"
                                                    component="h2">
                                            {message.content}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {dateToTimeStringConverter(message.createdAt)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </ListItem>
                    ) :
                    (
                        <ListItem key={message.message_id}>
                            <Card className={classes.otherMessages}>
                                <CardActionArea>
                                    <CardContent>
                                        <Avatar
                                            className={classes.otherAvatar}>{message.username[0].toLocaleUpperCase()}</Avatar>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {message.username}
                                        </Typography>
                                        <Typography style={{marginTop: '15px'}} gutterBottom variant="h8"
                                                    component="h2">
                                            {message.content}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {dateToTimeStringConverter(message.createdAt)}
                                        </Typography>

                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </ListItem>
                    )
            ))}
            <div ref={messagesEndRef}/>
        </List>
    )

}