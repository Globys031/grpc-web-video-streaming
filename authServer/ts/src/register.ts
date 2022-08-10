import {grpc} from "@improbable-eng/grpc-web";
import {AuthService} from "../protoLibrary/auth_pb_service";
import * as library from "../protoLibrary/auth_pb";
import "../../static/style.css";

import { client } from "@improbable-eng/grpc-web/dist/typings/client";

declare const USE_TLS: boolean;
const host = USE_TLS ? "https://127.0.0.1:9091" : "http://127.0.0.1:9090";

function generateClientTag() {
    return Math.random().toString(36).substr(2, 6);
}
const clientTag = generateClientTag();
const me = `Client#${clientTag}`;

function printError(variable:any, errorMessage:string) {
    if (variable == null) {
        console.error(errorMessage)
    }
}

window.onload = () => {
    // const messageTextInput = document.getElementById("message-text-input") as HTMLInputElement | null;
    // printError(messageTextInput, "Couldn't get message-text-input")

    // const sendButton = document.getElementById("send-button");
    // printError(sendButton, "Couldn't get send-button")

    // var inboxDiv = document.getElementById("inbox-div");
    // printError(inboxDiv, "Couldn't get inbox-div")

    // if (sendButton != undefined && inboxDiv != undefined) {
    //     joinChatroom(inboxDiv)
    //     sendButton.onclick = () => {
    //         if (messageTextInput  != undefined) {
    //             var message:library.Message = sendMessage(messageTextInput)
    //         } else {
    //             console.log("Message text input is undefined")
    //         }
    //     };
    // } else {
    //     console.log("send-button and or inbox-div are undefined")
    // }
};

//////////////////////////////////////////////////////
//// Grpc implemented methods
//////////////////////////////////////////////////////
//
//

//
//
//////////////////////////////////////////////////////