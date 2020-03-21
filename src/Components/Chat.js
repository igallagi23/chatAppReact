import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {useHistory} from "react-router-dom";
import LeftGridComponent from "./LeftGridComponent";
import MessageComponent from "./MessageComponent";
import InputBox from "./InputBox";
import Background from "../images/background.jpeg"
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles(() => ({
        root: {
            flexGrow: 1,
            position: 'absolute',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            background: `url(${Background})`,
            backgroundSize:'repeat'
        },
        leftGrid: {
            textAlign: 'left',
            height: '100%',
            direction: 'rtl',
        },
        rightGrid: {
            height: '100%',
        },
    }
));

export default function Chat() {
    const classes = useStyles();
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('userID') == 0) history.push('/');
        window.addEventListener('beforeunload', LeftGridComponent.logoutFunction);
        return () => {
            window.removeEventListener('beforeunload', LeftGridComponent.logoutFunction);
        }
    }, [history]);

    return (
        <Grid justify="center" container className={classes.root} spacing={1}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            <Grid className={classes.leftGrid} item xs={2}>
                <LeftGridComponent></LeftGridComponent>
            </Grid>
            <Grid className={classes.rightGrid} item xs={10}>
                <MessageComponent ></MessageComponent>
                <InputBox></InputBox>
            </Grid>
        </Grid>
    );
}
