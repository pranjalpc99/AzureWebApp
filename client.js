import { CallClient, CallAgent, Renderer, LocalVideoStream, CallApiFeature, CallFeatureFactoryType, Features } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
const { CommunicationIdentityClient } = require('@azure/communication-identity');
//const { Connection, Request } = require("tedious");
const { InteractiveBrowserCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
import { AzureLogger } from '@azure/logger';
const { Howl, Howler } = require('howler');
//const readline = require('readline');
//const http = require('http');
//const connect = require('connect');
//import express from 'express';
//var cors = require('cors');

//import { hello } from "./app.js"

//var app = require('express')();



//var Connection = require('tedious').Connection;


AzureLogger.verbose = (...args) => { console.info(...args); }
AzureLogger.info = (...args) => { console.info(...args); }
AzureLogger.warning = (...args) => { console.info(...args); }
AzureLogger.error = (...args) => { console.info(...args); }

let call;
let callAgent;
let inCome;
const communicationResourceString = "endpoint=https://azurecommunication.communication.azure.com/;accesskey=W6Ltbn66XCRIT4r5CtVBu3+rQXNvaOv7PFUw2vkQs0Vop3VubYLtZj/S0pgrtX9dYgKJI/Vxw9/boyKoqd0bjg=="
const userIdText = document.getElementById("myUserId");
const userTokenInput = document.getElementById("userToken-id-input");
const calleeInput = document.getElementById("callee-id-input");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
const micButton = document.getElementById("mic-button");
//const stopVideoButton = document.getElementById("stop-Video");
const startVideoButton = document.getElementById("start-Video");
//const acceptCallButton = document.getElementById("accept-Call");
const callerInfoDiv = document.getElementById("callerInfo");
var callerName = document.getElementById("callerName");
var localVideo = document.getElementById("myVideoContainer");
var remoteVideo = document.getElementById("remoteVideoContainer");
var sound;
var x = document.getElementById("ringtone");
var micState = true;
var videoState = true;
var videoCallState = false;
var width;
var height;

// const config = {
//     authentication: {
//         options: {
//             userName: "azureuser", // update me
//             password: "AzurePranjal@123" // update me
//         },
//         type: "default"
//     },
//     server: "userdatabasesqlserver.database.windows.net", // update me
//     options: {
//         database: "UserDatabase", //update me
//         encrypt: true
//     }
// };


let placeCallOptions;
let deviceManager;
let localVideoStream;
let rendererLocal;
let rendererRemote;
let userToken;
let userId;
let user_Access_Token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmQzNWZhMjQxLWZmN2QtNGVmZi04ZTBhLWFmYmI0ZTgyNDhmZl8wMDAwMDAwOC1mZDNiLThiNDktNTRiNy1hNDNhMGQwMDE0ZDQiLCJzY3AiOjE3OTIsImNzaSI6IjE2MTY0NzM4NzciLCJpYXQiOjE2MTY0NzM4NzcsImV4cCI6MTYxNjU2MDI3NywiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6ImQzNWZhMjQxLWZmN2QtNGVmZi04ZTBhLWFmYmI0ZTgyNDhmZiJ9.0nJ5mWWWQjrXf0mTvI3chmaWSAuXf-ygtKsws0XU6witH061vjFaR2V1PQ7Cqw3UX1wKnkKKYUUPRSa5H4a0YCijMtAImcny9UM4wyhMI8UOfQPZyq4OLlNGtWnmx4i3JlGBjAbbMQvdsnCAyzLO0hInrFzBsJIJ6hewfDQNajknDQnr5XjXc8zHdTKYLlpPm042INsc7yJQYhQYgTxsgiy3_ROJw_Kcbsi93_bz2cumUDI4YxUwh0j6AE68y190kdGzSlMCtXAAJJLntG-je10YxvF3KQyxtZYO2OtOXiEDJ1T9Fo6OIY1TbcBmog0jiD7BYukNZ-moevXBCPjyQw"
let user_Access_Token2 = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmQzNWZhMjQxLWZmN2QtNGVmZi04ZTBhLWFmYmI0ZTgyNDhmZl8wMDAwMDAwOC1mODRkLThlMzgtNzFiZi1hNDNhMGQwMGMyNWYiLCJzY3AiOjE3OTIsImNzaSI6IjE2MTYzOTExNzEiLCJpYXQiOjE2MTYzOTExNzEsImV4cCI6MTYxNjQ3NzU3MSwiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6ImQzNWZhMjQxLWZmN2QtNGVmZi04ZTBhLWFmYmI0ZTgyNDhmZiJ9.Gr4b4Q2cbte6wgUDXolh6BAXcLsV4DLHCVTOlmaZaM-p1LNVREf3RR8Oh3qhUUY7o2N1lMZdfdxPwB4jylZRnSTMS3Vccx34KyrdlKZFV1nqZJOB0kSG_Upns27p4jKujo-iV-gxFzGFvVf4V2GNCNDuJkSvzvgV5PWvC3dADmy0MGAADpAK5f0tnl-IawmWkNaREoU97s1Y_p8o6Jc7mbOVx2CjN3uQIcTRMAFPuNmi85hplJcClLbr10zEtMt-OC8YoH_fUEru23NNJ_cZvTnoY-Z2wsUvkRzu3eGC8AvSDQ9LRMh_j9KVndoaSsfTlJFRw0nRlgZB6HgCqQH2jg"

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

function handleVideoStream(remoteVideoStream) {
    remoteVideoView(remoteVideoStream);
    remoteVideoStream.on('availabilityChanged', async() => {
        if (remoteVideoStream.isAvailable) {
            remoteVideoView(remoteVideoStream);
        } else {
            rendererRemote.dispose();
        }
    });
    if (remoteVideoStream.isAvailable) {
        remoteVideoView(remoteVideoStream);
    }
}

function subscribeToRemoteParticipant(remoteParticipant) {
    remoteParticipant.videoStreams.forEach(v => {
        handleVideoStream(v);
    });
    remoteParticipant.on('videoStreamsUpdated', e => {
        e.added.forEach(v => {
            handleVideoStream(v);
        })
    });
}

function subscribeToRemoteParticipantInCall(callInstance) {
    console.log(callInstance.callEndReason);
    callInstance.remoteParticipants.forEach(p => {
        subscribeToRemoteParticipant(p);
    })

    callInstance.on('remoteParticipantsUpdated', e => {
        e.added.forEach(p => {
            subscribeToRemoteParticipant(p);
        })
    });
}

const main = async() => {

    //const credential = new InteractiveBrowserCredential({ redirectUri: "http://localhost:8080/", tenantId: "53f08148-43de-4a2b-bec3-1a9446ff6a20", clientId: "a5b5762c-c3f6-4980-96f2-670682cdd351" });
    //console.log(credential)

    //const vaultName = "azurepranjalvault";
    //const url = "https://" + vaultName + ".vault.azure.net";

    //const client = new SecretClient(url, credential);

    //const secretName = "ConnectionString";

    //httpRequestCall(client)


    //var port = process.env.PORT || 8080;
    //server.listen(port);

    //console.log("Server running at http://localhost:%d", port);

    //const retrievedSecret = await client.getSecret(secretName);

    //console.log("Your secret is '" + retrievedSecret.value + "'.");


    // console.log("Azure Communication Services - Access Tokens Quickstart")

    // const keyVaultName = "azurepranjalvault";
    // const KVUri = "https://" + keyVaultName + ".vault.azure.net";
    // console.log("keyvault-> ".concat(KVUri))

    // const credential = new DefaultAzureCredential();
    // const client = new SecretClient(KVUri, credential);

    // const secretName = "ConnectionString";

    // const retrievedSecret = await client.getSecret(secretName);

    // console.log("Your secret is '" + retrievedSecret.value + "'.");

    // Quickstart code goes here
    localVideo.style.display = "none";
    remoteVideo.style.display = "none";
    hangUpButton.style.display = "none";
    callerInfoDiv.style.display = 'none';
    //startVideoButton.style.display = "none";
    //startVideoButton.style.display = "none";
    //stopVideoButton.style.display = "none";
    //acceptCallButton.style.display = "none";
    console.log("Local Display -> " + localVideo.style.display)
    const identityClient = new CommunicationIdentityClient(communicationResourceString);
    let identityTokenResponse = await identityClient.createUserAndToken(["voip"]);
    const { token, expiresOn, user } = identityTokenResponse;
    console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
    console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
    console.log(token);
    userToken = token;
    userId = user.communicationUserId;
    initialize();
};

function httpRequestCall(client) {
    var server = http.createServer(function(request, response) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        async function main() {
            // Get the secret we created
            const secret = await client.getSecret(secretName);
            response.write(`Your secret value is: ${secret.value}`);
            response.end();
        }
        main().catch((err) => {
            response.write(`error code: ${err.code}`);
            response.write(`error message: ${err.message}`);
            response.write(`error stack: ${err.stack}`);
            response.end();
        });
    });
}

main().catch((error) => {
    console.log("Encountered an error");
    console.log(error);
})

async function initialize() {

    // const conn = new mysql.createConnection(config);

    // conn.connect(
    //     function(err) {
    //         if (err) {
    //             console.log("!!! Cannot connect !!! Error:");
    //             throw err;
    //         } else {
    //             console.log("Connection established.");
    //             queryDatabase();
    //         }
    //     });

    userIdText.innerHTML = userId;
    width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const callClient = new CallClient({ logger: AzureLogger });
    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'optional ACS user name' });


    deviceManager = await callClient.getDeviceManager();
    callButton.disabled = false;
    micButton.disabled = false;
    startVideoButton.disabled = false;
    console.log("call button prop" + callButton.disabled)

    callAgent.on('incomingCall', async e => {
        inCome = e;
        const videoDevices = await deviceManager.getCameras();
        const videoDeviceInfo = videoDevices[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        localVideoView();

        const callerIdentity = e.incomingCall.callerInfo.displayName;
        const callState = e.incomingCall.state;
        console.log("State->".concat(callState));
        console.log("Caller->" + callerIdentity.toString())

        callerInfoDiv.style.display = 'block';
        callerName.innerHTML = e.incomingCall.id;

        playAudio();

        //stopVideoButton.disabled = false;
        //callButton.disabled = true;
        hangUpButton.disabled = false;
        //acceptCallButton.disabled = false;
        videoCallState = true;

    });

    callAgent.on('callsUpdated', e => {
        e.removed.forEach(removedCall => {
            // dispose of video renderers
            rendererLocal.dispose();
            rendererRemote.dispose();
            // toggle button states
            hangUpButton.disabled = true;
            callButton.disabled = false;
            localVideo.style.display = 'none';
            remoteVideo.style.display = 'none';
            hangUpButton.style.display = 'none';
            callerInfoDiv.style.display = 'none';
            callButton.style.display = 'block';
            //stopVideoButton.disabled = true;
        })
    })
}

async function playAudio() {
    x.loop = true;
    x.load();
    x.play();
}

async function localVideoView() {
    rendererLocal = new Renderer(localVideoStream);
    const view = await rendererLocal.createView();
    view.updateScalingMode('Fit');
    document.getElementById("myVideo").appendChild(view.target);

}

async function remoteVideoView(remoteVideoStream) {
    rendererRemote = new Renderer(remoteVideoStream);
    const view = await rendererRemote.createView();
    view.updateScalingMode('Fit');
    document.getElementById("remoteVideo").appendChild(view.target);
}

callButton.addEventListener("click", async() => {

    console.log("Call button pressed - > " + videoCallState)
    localVideo.style.display = 'block';
    remoteVideo.style.display = 'block';
    callButton.style.display = "none";
    hangUpButton.style.display = "block";
    startVideoButton.style.display = "block";

    if (videoCallState == false) {

        //startVideoButton.style.display = "block";
        //stopVideoButton.style.display = "block";
        //acceptCallButton.style.display = "block";

        console.log("Local Display -> " + localVideo.style.display)

        const videoDevices = await deviceManager.getCameras();
        const videoDeviceInfo = videoDevices[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        placeCallOptions = { videoOptions: { localVideoStreams: [localVideoStream] } };

        localVideoView();
        //stopVideoButton.disabled = false;
        startVideoButton.disabled = true;

        const userToCall = calleeInput.value;
        call = callAgent.startCall(
            [{ communicationUserId: userToCall }],
            placeCallOptions
        );

        const callRecordingApi = call.api(Features.Recording);
        const isResordingActive = callRecordingApi.isRecordingActive;
        console.log("Is recording -> " + isResordingActive)
        console.log("Is recording 2-> " + callRecordingApi.name)


        subscribeToRemoteParticipantInCall(call);

        hangUpButton.disabled = false;
        callButton.disabled = true;
    } else {
        x.pause();
        const addedCall = await inCome.incomingCall.accept({ videoOptions: { localVideoStreams: [localVideoStream] } });
        call = addedCall;

        subscribeToRemoteParticipantInCall(addedCall);
    }


});

// stopVideoButton.addEventListener("click", async() => {
//     await call.stopVideo(localVideoStream);
//     rendererLocal.dispose();
//     startVideoButton.disabled = false;
//     stopVideoButton.disabled = true;

// });

startVideoButton.addEventListener("click", async() => {
    if (videoState == true) {
        videoState = false;
        startVideoButton.innerHTML = "videocam_off"
        if (!call) {
            rendererLocal.dispose();
        } else {
            await call.stopVideo(localVideoStream);
            rendererLocal.dispose();
        }
    } else {
        videoState = true;
        startVideoButton.innerHTML = "videocam"
        if (!call) {
            localVideoView();
        } else {
            await call.startVideo(localVideoStream);
            localVideoView();
            //stopVideoButton.disabled = false;
            //startVideoButton.disabled = true;
        }
    }
    console.log("Call state -> " + call);
    console.log("Video state - > " + videoState);

})

micButton.addEventListener("click", async() => {
    if (micState === true) {
        micState = false
        micButton.innerHTML = "mic_off"
        await call.mute()
    } else {
        micState = true
        micButton.innerHTML = "mic"
        await call.unmute()
    }

    console.log("Mic state - > " + micState);
})

hangUpButton.addEventListener("click", async() => {
    // dispose of video renderers
    rendererLocal.dispose();
    rendererRemote.dispose();
    // end the current call
    await call.hangUp();
    // toggle button states
    hangUpButton.disabled = true;
    callButton.disabled = false;
    localVideo.style.display = 'none';
    remoteVideo.style.display = 'none';
    hangUpButton.style.display = 'none';
    callerInfoDiv.style.display = 'none';
    callButton.style.display = 'block';
    //stopVideoButton.disabled = true;
});

// acceptCallButton.addEventListener("click", async() => {
//     x.pause();
//     const addedCall = await inCome.incomingCall.accept({ videoOptions: { localVideoStreams: [localVideoStream] } });
//     call = addedCall;

//     subscribeToRemoteParticipantInCall(addedCall);
// })