import { CallClient, CallAgent, Renderer, LocalVideoStream } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
const { CommunicationIdentityClient } = require('@azure/communication-identity');
//const { Connection, Request } = require("tedious");
const { DefaultAzureCredential } = require("@azure/identity");
import { AzureLogger } from '@azure/logger';
const { Howl, Howler } = require('howler');
//const readline = require('readline');

//var Connection = require('tedious').Connection;

AzureLogger.verbose = (...args) => { console.info(...args); }
AzureLogger.info = (...args) => { console.info(...args); }
AzureLogger.warning = (...args) => { console.info(...args); }
AzureLogger.error = (...args) => { console.info(...args); }

let call;
let callAgent;
let inCome;
const communicationResourceString = "endpoint=https://testapicommunication.communication.azure.com/;accesskey=so6HgfoI5ukEaaiaBIHHvxidJrNAhLBs+hNwaj3fCU4VX1HfugSFW9/2sml3sp/IQ+WoOLILTFiLDwP49/7nMQ=="
const userIdText = document.getElementById("myUserId");
const userTokenInput = document.getElementById("userToken-id-input");
const calleeInput = document.getElementById("callee-id-input");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
const stopVideoButton = document.getElementById("stop-Video");
const startVideoButton = document.getElementById("start-Video");
//const setUserButton = document.getElementById("setUser-button")
const acceptCallButton = document.getElementById("accept-Call");
var sound;
var x = document.getElementById("ringtone");

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

main().catch((error) => {
    console.log("Encountered an error");
    console.log(error);
})

async function init() {
    console.log("init")
        //setUserButton.disabled = false;
}
init();

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

    const callClient = new CallClient({ logger: AzureLogger });
    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'optional ACS user name' });


    deviceManager = await callClient.getDeviceManager();
    callButton.disabled = false;
    console.log("call button prop" + callButton.disabled)

    callAgent.on('incomingCall', async e => {
        inCome = e;
        const videoDevices = await deviceManager.getCameras();
        const videoDeviceInfo = videoDevices[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        localVideoView();

        const callerIdentity = e.incomingCall.callerInfo.identifier;
        const callState = e.incomingCall.state;
        console.log("State->".concat(callerIdentity));

        playAudio();

        stopVideoButton.disabled = false;
        callButton.disabled = true;
        hangUpButton.disabled = false;
        acceptCallButton.disabled = false;

    });

    callAgent.on('callsUpdated', e => {
        e.removed.forEach(removedCall => {
            // dispose of video renderers
            rendererLocal.dispose();
            rendererRemote.dispose();
            // toggle button states
            hangUpButton.disabled = true;
            callButton.disabled = false;
            stopVideoButton.disabled = true;
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
    document.getElementById("myVideo").appendChild(view.target);
}

async function remoteVideoView(remoteVideoStream) {
    rendererRemote = new Renderer(remoteVideoStream);
    const view = await rendererRemote.createView();
    document.getElementById("remoteVideo").appendChild(view.target);
}

callButton.addEventListener("click", async() => {
    const videoDevices = await deviceManager.getCameras();
    const videoDeviceInfo = videoDevices[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = { videoOptions: { localVideoStreams: [localVideoStream] } };

    localVideoView();
    stopVideoButton.disabled = false;
    startVideoButton.disabled = true;

    const userToCall = calleeInput.value;
    call = callAgent.startCall(
        [{ communicationUserId: userToCall }],
        placeCallOptions
    );


    subscribeToRemoteParticipantInCall(call);

    hangUpButton.disabled = false;
    callButton.disabled = true;
});

stopVideoButton.addEventListener("click", async() => {
    await call.stopVideo(localVideoStream);
    rendererLocal.dispose();
    startVideoButton.disabled = false;
    stopVideoButton.disabled = true;

});

startVideoButton.addEventListener("click", async() => {
    await call.startVideo(localVideoStream);
    localVideoView();
    stopVideoButton.disabled = false;
    startVideoButton.disabled = true;
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
    stopVideoButton.disabled = true;
});

acceptCallButton.addEventListener("click", async() => {
    x.pause();
    const addedCall = await inCome.incomingCall.accept({ videoOptions: { localVideoStreams: [localVideoStream] } });
    call = addedCall;

    subscribeToRemoteParticipantInCall(addedCall);
})