// require the websocket library
const WebSocket = require('ws');
// create a websocket server instance but don't start a standalone server ('noServer' option)
const wss = new WebSocket.Server({ noServer: true });
// initialize a map to keep track of all connected websocket clients
const clients = new Map();

// function to set up websocket server
function setupWebSocketServer(server) {
    // listen for 'upgrade' events on the HTTP server. event is emitted when client requests to switch from HTTP to websocket
    server.on('upgrade', (request, socket, head) => {
        // handle the upgrade internally within the websocket server
        wss.handleUpgrade(request, socket, head, (ws) => {
            // parse the clients URL and extract query parameters
            const queryParams = new URLSearchParams(request.url?.split('?')[1]);
            // get the clientId from query parameters
            const clientId = queryParams.get('clientId');
            console.log('this is the clientId in setupWebSocket', clientId);
            // if a clientId is provided
            if (clientId) {
                console.log('if statement hit in setupWebSocket');
                // add the new websocket connection to the 'clients' map
                clients.set(clientId, ws);
                console.log('websocket client connected with ID:', clientId);
                // listen for 'close' events on this websocket connection
                ws.on('close', () => {
                    // when connection closes, remove it from the 'clients' map
                    clients.delete(clientId);
                    console.log(`websocket client disconnected with ID: ${clientId}`);
                });
                // send test message to client confirming the connection
                ws.send(JSON.stringify({ type: 'test', content: 'connection established '}));
            } else {
                // if no 'clientId' was provided, destory the socket so it doesn't remain open
                socket.destroy();
                console.log('websocket client connection attempt without clientId')
            }
        });
    });
};

function getClient(clientId) {
    // return websocket associated with the clientId from the map
    return clients.get(clientId);
};

function deleteClient(clientId) {
    // delete the client id from the map
    clients.delete(clientId);
};

module.exports = {
    setupWebSocketServer,
    getClient,
    deleteClient,
};