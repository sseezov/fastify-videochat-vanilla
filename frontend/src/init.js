import { io } from "socket.io-client";
import Peer from 'peerjs'
import { PEER_CONFIG } from "./config.js";
import { ROOM_ID } from "./config.js";
import { initControls, mountVideoStream } from "./dom-helpers/video.js";
import { connectToNewUser, disonnectUser } from "./services/socket-service.js";
import { handleCall, handleOpen } from "./services/peer-service.js";
import { addMessageToChat, initChat } from "./dom-helpers/chat.js";
import { initShareScreen } from "./dom-helpers/screen-share.js";

const peer = new Peer(undefined, PEER_CONFIG);
const socket = io();

let videoStream;
const peers = {};
const mountedVideos = new Set();

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  videoStream = stream;
  mountVideoStream(mountedVideos, stream);
  initControls(stream, peers);
  initShareScreen(peers, () => videoStream)
}).catch(err => {
  console.error('Failed to get media devices:', err);
});

initChat(socket)

peer.on('open', (id) => handleOpen(id, () => videoStream, socket, ROOM_ID));
peer.on('call', (call) => handleCall(call, () => videoStream, peers, mountedVideos));
peer.on('error', (err) => console.error('Peer error:', err));
peer.on('disconnected', () => {
  console.log('Peer disconnected, reconnecting...');
  peer.reconnect();
});

socket.on('user-connected', (userId) => connectToNewUser(peers, peer, userId, videoStream, mountedVideos));
socket.on('user-disconnected', (userId) => disonnectUser(peers, mountedVideos, userId));
socket.on('create-message', (msg) => addMessageToChat(msg))
socket.on('connect_error', (err) => console.error('Socket connection error:', err));
