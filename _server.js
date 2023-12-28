const express = require('express');
const http = require('http');
const https = require('spdy');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/protocolo2', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/protocolo2.html'));
});

 app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Erro ao enviar o arquivo: ${err}`);
      res.status(404).send('Arquivo não encontrado');
    }
  });
});

// Configuração para o servidor HTTPS (HTTP/2)
const options = {
  key: fs.readFileSync(path.resolve('./certs/server.key')),
  cert: fs.readFileSync(path.resolve('./certs/server.crt')),
};

const httpsServer = https.createServer(options, app);
const httpsPort = 3001;

httpsServer.on('secureConnection', (tlsSocket) => {
  const alpnProtocol = tlsSocket.alpnProtocol;
  console.log(`Conexão segura estabelecida usando o protocolo: ${alpnProtocol}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`Servidor HTTPS (HTTP/2) iniciado em https://localhost:${httpsPort}/protocolo2`);
});

// Configuração para o servidor HTTP (HTTP/1)
const httpApp = express();

httpApp.get('/protocolo1', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/protocolo1.html'));
});

httpApp.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Erro ao enviar o arquivo: ${err}`);
      res.status(404).send('Arquivo não encontrado');
    }
  });
});

const httpServer = http.createServer(httpApp);
const httpPort = 3000;

httpServer.listen(httpPort, () => {
  console.log(`Servidor HTTP (HTTP/1) iniciado em http://localhost:${httpPort}/protocolo1`);
});