const http = require('http');
const https = require('https');
const url = require('url');

// Helper function to stream content from a given URL
function streamContent(targetUrl, clientResponse) {
  const parsedUrl = url.parse(targetUrl);
  const protocol = parsedUrl.protocol === 'https:' ? https : http;

  protocol
    .get(targetUrl, (res) => {
      if (res.statusCode === 200) {
        // Pipe the response directly to the client
        clientResponse.writeHead(200, {
          'Content-Type': res.headers['content-type'],
          'Content-Length': res.headers['content-length'],
        });
        res.pipe(clientResponse);
      } else {
        clientResponse.writeHead(res.statusCode);
        clientResponse.end(`Error: ${res.statusCode}`);
      }
    })
    .on('error', (err) => {
      console.error('Error fetching URL:', err.message);
      clientResponse.writeHead(500);
      clientResponse.end('Internal Server Error');
    });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  const queryUrl = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
  if (queryUrl) {
    console.log(`Streaming: ${queryUrl}`);
    streamContent(queryUrl, res);
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: Missing "url" query parameter');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
