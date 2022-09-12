import net from 'net';
import chalk from 'chalk';

const terminalLog = (...args) => console.log(chalk.cyan('[server]: '), ...args);

export const serve = (host, port) => {
    const server = net.createServer((socket) => {
        terminalLog('A peer connected!')
        socket.on('data', (data) => {
            const dataString = data.toString();
            terminalLog('Received data: ', dataString);
            const lines = dataString.split('\n');
            const startLine = lines[0];

            const [method, path] = startLine.split(' ');
            
            if (method == 'GET' && path == '/') {
                
                const body = `<html>
                <main>
                <h1>GET / HTML body</h1>
                </main>
                </html>`;
                const getRequest = `HTTP/1.1 200 OK
            Content-Length: ${body.length}
            Content-Type: text/html

            ${body}`;
            socket.write(getRequest)
        } else {
            socket.write(data.toString().toUpperCase());
        }
        });
        socket.on('end', () => {
            terminalLog('Client disconnected.');
        });
        socket.on('error', (err) => {
            terminalLog('Received error: ', err)
        })
    });
    server.listen(port, host, () => {
        terminalLog(`Server is running on port:${port}`)
    })
    terminalLog('Attempting to start server')
}