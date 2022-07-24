onconnect = function (e) {
    var port = e.ports[0];
    port.onmessage = function (e) {
        let { x, y } = e.data;
        port.postMessage({ result: x + y + 'hhhfhh!' });
    }
}