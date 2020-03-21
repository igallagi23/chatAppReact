import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import App from "../App";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(() => ({
        helloZone: {
            background: 'rgb(211,217,231,0.6)',
            maxHeight: '25%',
            minHeight: '20%',
            color:'rgb(56,60,88)',
        },
        connectionList: {
            overflowY: 'scroll',
            scrollBarWidth: 'none',
            scrollBarColor:'green',
            maxHeight: '75%',
            background: 'rgb(163,172,197)',
            overflowX: 'hidden',
        },

        userCard: {
            width: '100%',
            textAlign: 'center',
            height:'50px',
            color:'white',
            background:'rgb(255,255,255,0.2)'
        },
        paper: {
            position: 'relative',
            height: '100%'
        },
        logoutButton: {
            float:'right',
            marginTop: '5px',
            marginRight: '5px',
            marginLeft: '20px',
            marginBottom:'10px',
            background: 'rgb(107,122,163)',
            color:'white'
        }
    }
));

//include connection list and hello and logout button
export default function LeftGridComponent() {
    const [numOfConnectedUsers, setNumOfConnectedUsers] = useState(0);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    //add to this object, that the Chat component will use it on close tab
    LeftGridComponent.logoutFunction = async (event) => {
        event.preventDefault();
        const body1 = JSON.stringify({
            userID: localStorage.getItem('userID')
        });
        try {
            const response = await fetch(App.serverIp+'/logout',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body1
                });
            if (response.ok === true) {
                localStorage.setItem('username', '');
                localStorage.setItem('userID', '0');
                history.push('/');
            }
        } catch (e) {
            console.log(e);
            //leave anyway, user doesnt care
            history.push('/');
        }
    };

    //fetch connected users interval
    useEffect(() => {
        const intervalId = setInterval(() => {
            (async function fetchConnected() {
                try {
                    const response = await fetch(App.serverIp+'/get_all_connected',
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'GET',
                        });

                    if (response.ok === true) {
                        let users = await response.json();
                        setConnectedUsers(users.body);
                        setNumOfConnectedUsers(users.body.length);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }, App.intervalTime);
        return () => clearInterval(intervalId); //This is important
    }, []);


    return(
        <Paper className={classes.paper}>
            <Button className={classes.logoutButton} variant="contained"
                    onClick={LeftGridComponent.logoutFunction}>Logout</Button>

            <Paper className={classes.helloZone}>
                <h3 style={{marginLeft:'10px'}}>Hello </h3>
                <h3  style={{marginLeft:'10px'}}> {localStorage.getItem('username')}</h3>
                <Divider/>
                <h3 style={{textAlign:'center',color:'rgb(75,127,74)'}}>Connected Users : {numOfConnectedUsers}</h3>
            </Paper>
            <List className={classes.connectionList}>
                {connectedUsers.map((user) => (
                    (<ListItem key={user.user_id}>
                        <Card className={classes.userCard}><h4>{user.username}</h4></Card>
                    </ListItem>)
                ))}
            </List>
        </Paper>
    )

}