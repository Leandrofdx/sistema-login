const express = require('express');
const spdy = require('spdy');
const { promises: fs, createReadStream } = require('fs');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const startServer = async () => {
  const app = express();
  const httpPort = 3000;
  const grpcPort = 50051;

  const imagesPath = path.join(__dirname, 'public', 'images');

  app.get('/images', async (req, res) => {
    try {
      const files = await fs.readdir(imagesPath);
      const jpegFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpeg');
      const images = jpegFiles.map(file => ({
        url: `/images/${file}`,
        description: file.replace(/\.[^/.]+$/, ''),
      }));

      res.json({ images });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/images/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(imagesPath, filename);

    try {
      const stream = createReadStream(filePath);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);
      stream.pipe(res);
      stream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const httpOptions = {
    key: await fs.readFile(path.resolve('./certs/server.key')),
    cert: await fs.readFile(path.resolve('./certs/server.crt')),
  };

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  const httpServer = spdy.createServer(httpOptions, app);
  httpServer.listen(httpPort, () => {
    console.log(`HTTP Server running at https://localhost:${httpPort}/images`);
  });

  const protoPath = path.join(__dirname, 'proto', 'images.proto');
  const packageDefinition = protoLoader.loadSync(protoPath);
  const imagesProto = grpc.loadPackageDefinition(packageDefinition).images;

  const grpcService = {
    ListImages: async (_, callback) => {
      try {
        const files = await fs.readdir(imagesPath);
        const jpegFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpeg');

        // Utilizar Promise.all para processamento paralelo
        const imagesPromises = jpegFiles.map(async (file) => ({
          url: `/images/${file}`,
          description: file.replace(/\.[^/.]+$/, ''),
        }));

        const images = await Promise.all(imagesPromises);

        callback(null, { images });
      } catch (error) {
        console.error(error);
        callback({ message: 'Internal Server Error' });
      }
    },
  };

  const grpcServer = new grpc.Server();
  grpcServer.addService(imagesProto.ImageService.service, grpcService);

  const grpcOptions = {
    'grpc.ssl_target_name_override': 'localhost',
    'grpc.default_authority': 'localhost',
    'grpc.keepalive_time_ms': 60000,
    key: await fs.readFile(path.resolve('./certs/server.key')),
    cert: await fs.readFile(path.resolve('./certs/server.crt')),
  };

  grpcServer.bindAsync(`localhost:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
    grpcServer.start();
    console.log(`gRPC Server running at https://localhost:${grpcPort}`);
  });
};

startServer().catch(error => console.error(error));