import ballerina/websocket;
import ballerina/log;

@websocket:ServiceConfig {}
isolated service /ws on new websocket:Listener(8080) {
    isolated resource function get .() returns websocket:Service {
        return new IsolatedEditorService();
    }
}

isolated service class IsolatedEditorService {
    *websocket:Service;
    private map<websocket:Caller> connections = {};

    isolated remote function onConnect(websocket:Caller caller) returns error? {
        lock {
            self.connections[caller.getConnectionId()] = caller;
            log:printInfo("Client connected: " + caller.getConnectionId());
        }
    }

    isolated remote function onMessage(websocket:Caller caller, string|json|byte[] payload) returns error? {
        if payload is string {
            lock {
                foreach var connectionId in self.connections.keys() {
                    var connection = self.connections.get(connectionId);
                    if (connection is websocket:Caller) {
                        error? result = connection->writeTextMessage(payload);
                        if (result is error) {
                            log:printError("Error sending message", 'error = result);
                        }
                    }
                }
            }
        }
    }

    isolated remote function onClose(websocket:Caller caller) returns error? {
        lock {
            _ = self.connections.remove(caller.getConnectionId());
            log:printInfo("Client disconnected: " + caller.getConnectionId());
        }
    }

    isolated remote function onError(websocket:Caller caller, error err) {
        log:printError("Error occurred:", 'error = err);
    }
}