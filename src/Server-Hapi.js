const Hapi = require('@hapi/hapi');
const NotesService = require('./Services/Postgres/NotesService');
const notes = require('./Api/Notes');
const NotesValidator = require('./Validator');
require('dotenv').config();

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: true,
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });
  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();