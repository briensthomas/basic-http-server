import net from 'net';

export const serve = (host, port) => {
    const server = net.createServer((socket) => {
        console.log('A peer connected!')
    });
    server.listen(port, host, () => {
        console.log(`Server is running on port:${port}`)
    })
}