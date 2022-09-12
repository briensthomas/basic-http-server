import net from 'net';
import chalk from 'chalk';

const terminalLog = (...args) => {
    if (process.env['NODE_ENV'] !== 'test') {
    console.log(chalk.cyan('[server]: '), ...args);
}
};

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

        const getHome = `HTTP/1.1 200 Ok
Content-Length: ${body.length}
Content-Type: text/html

${body}`;
        socket.write(getHome)
        } else if (method == 'GET' && path == '/posts') {
            const json = `[
    {
        "id": "1",
        "name": "Joe Mama"
    }
]`;
        const getPosts = `HTTP/1.1 200 OK
Content-Length: ${json.length}
Content-Type: application/json

${json}`;
        socket.write(getPosts);
        } else if (method == 'POST' && path == '/mail') {

            const postMail = `HTTP/1.1 204 No Content
Content-Length: 0
Host: http://localhost:8080/mail

`;
        socket.write(postMail);
        } else if (method == 'PUT' || method == 'DELETE') {
            const notFound = `HTTP/1.1 404 Not Found
Accept: text/html, application/json
Content-Length: 0

`;
console.log(notFound);
socket.write(notFound);
        } else {
            socket.write(data.toString().toUpperCase());
        }
        });
        socket.on('end', () => {
            terminalLog('Client disconnected.');
        });
        socket.on('error', (err) => {
            terminalLog('Received error: ', err);
        })
    });
    server.listen(port, host, () => {
        terminalLog(`Server is running on port:${port}`);
    })
    terminalLog('Attempting to start server');
    return server;
}