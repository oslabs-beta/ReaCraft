import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import { URLSearchParams } from 'url';

// Create a WebSocket server instance but don't start a standalone server ('noServer' option)
const wss = new WebSocket.Server({ noServer: true });

// Initialize a map to keep track of all connected WebSocket clients
const clients = new Map<string, WebSocket>();

// Function to set up WebSocket server
export function setupWebSocketServer(server: HTTPServer): void {
  // Listen for 'upgrade' events on the HTTP server
  server.on('upgrade', (request, socket, head) => {
    // Handle the upgrade internally within the WebSocket server
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Parse the clients URL and extract query parameters
      const queryParams = new URLSearchParams(request.url?.split('?')[1]);
      // Get the clientId from query parameters
      const clientId = queryParams.get('clientId');
      console.log('this is the clientId in setupWebSocket', clientId);

      // If a clientId is provided
      if (clientId) {
        console.log('if statement hit in setupWebSocket');
        // Add the new WebSocket connection to the 'clients' map
        clients.set(clientId, ws);
        console.log('WebSocket client connected with ID:', clientId);

        // Listen for 'close' events on this WebSocket connection
        ws.on('close', () => {
          // When connection closes, remove it from the 'clients' map
          clients.delete(clientId);
          console.log(`WebSocket client disconnected with ID: ${clientId}`);
        });

        // Send test message to client confirming the connection
        ws.send(
          JSON.stringify({ type: 'test', content: 'connection established' })
        );
      } else {
        // If no 'clientId' was provided, destroy the socket
        socket.destroy();
        console.log('WebSocket client connection attempt without clientId');
      }
    });
  });
}

export function getClient(clientId: string): WebSocket | undefined {
  // Return WebSocket associated with the clientId from the map
  return clients.get(clientId);
}

export function deleteClient(clientId: string): void {
  // Delete the client id from the map
  clients.delete(clientId);
}
