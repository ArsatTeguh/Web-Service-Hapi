const Hapi = require('@hapi/hapi');
const routes = require('./Route');

const init = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', ' Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
      },
    },
  });
  server.route(routes);
  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();