import {grpc} from "@improbable-eng/grpc-web";
import {ChatService} from "../protoLibrary/chat_pb_service";
import * as library from "../protoLibrary/chat_pb";

import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

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

// Outputs message in the browser 
// and if sentByMe - adds the option to delete the message
function addMessageToInbox(message: library.Message, inboxDiv:HTMLElement) {
    const sentByMe = me == message.getUser()?.getName();

    const messageDiv = document.createElement("div");

    messageDiv.id = `message-${message.getMessageid()}`
    messageDiv.className = sentByMe ? "my" : "not my";
    messageDiv.className += " message";

    if (!sentByMe) {
        const senderP = document.createElement("p"); // creates sender paragraph
        senderP.className = "sender";

        senderP.innerHTML = message.getUser()?.getName() as string;
        messageDiv.appendChild(senderP);
    }

    const messageTextInput = document.createElement("input");
    messageTextInput.type = "text";
    messageTextInput.value = message.getMessage();
    messageDiv.appendChild(messageTextInput);

    if (sentByMe) {
        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        // Needs an implementation on the server side before uncommenting
        // deleteButton.onclick = () => {
        //     liveGoll.delete(message);
        // };
        messageDiv.appendChild(deleteButton);
    }

    const sentTimeP = document.createElement("p");
    sentTimeP.className = "time";
    sentTimeP.innerHTML = message.getSendtime()?.toDate().toLocaleTimeString() as string;
    // sentTimeP.innerHTML = new Date(message.getSendtime()?.toDate() as Date).toLocaleTimeString();
    messageDiv.appendChild(sentTimeP);

    inboxDiv.appendChild(messageDiv);
}

window.onload = () => {
    // liveGoll = new LiveGollection("ws://localhost:8080/livegollection");
    const messageTextInput = document.getElementById("message-text-input");
    printError(messageTextInput, "Couldn't get the text input field")

    const sendButton = document.getElementById("send-button");
    printError(sendButton, "Couldn't get the send button")

    var inboxDiv = document.getElementById("inbox-div");
    printError(inboxDiv, "Couldn't get inbox-div")


    // sendButton?.onclick
    sendButton.onclick = () => {
        var message:library.Message = sendMessage()
        addMessageToInbox(message, inboxDiv as HTMLElement);
    };
};

//////////////////////////////////////////////////////
//// Grpc implemented methods
//////////////////////////////////////////////////////
//
//
function joinChatroom() {
    const client = grpc.client(ChatService.JoinChatroom, {
        host: host,
    });


    const chatroom = new library.Chatroom();

    // Visi sitie on, reiskia kad vykdyk kai tas ivyks.
    // Pvz atsiuncia (speju) response header'ius - vykdyt,
    // atsiuncia zinute - vykdyt, etc...
    client.onHeaders((headers: grpc.Metadata, ) => {
      console.log("chatroom.onHeaders", headers);
    });
    client.onMessage((message: library.Message) => {
      console.log("chatroom.onMessage", message.toObject());
    });
    client.onEnd((code: grpc.Code, msg: string, trailers: grpc.Metadata) => {
      console.log("chatroom.onEnd", code, msg, trailers);
    });


    client.start();
    client.send(chatroom);
}
function sendMessage() : library.Message {
    const client = grpc.client(ChatService.SendMessage, {
        host: host, // grpc option
    });

    const message = new library.Message();
    const timestamp = new Timestamp();
    timestamp.fromDate(new Date());

    message.setMessage("My name a tony bamanaboni. Would you like some life insurance, yes?")
    message.setSendtime(timestamp)

    client.start();
    client.send(message);

    return message
}
function inviteToChatroom() {}
function listUsers() {}
function leave() {}
//
//
//////////////////////////////////////////////////////