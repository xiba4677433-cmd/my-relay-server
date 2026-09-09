const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });
let phone = null, pc = null;
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = message.toString();
        if (data.includes("join_phone")) phone = ws;
        else if (data.includes("join_pc")) pc = ws;
        else {
            if (ws === phone && pc) pc.send(data);
            if (ws === pc && phone) phone.send(data);
        }
    });
    ws.on('close', () => { if (ws === phone) phone = null; if (ws === pc) pc = null; });
});
server.listen(process.env.PORT || 3000);
