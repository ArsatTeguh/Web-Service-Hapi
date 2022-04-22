const Hapi = require('@hapi/hapi');
const NotesService = require('./Services/Postgres/NotesService');
const notes = require('./Api/Notes');
const users = require('./Api/Users');
const NotesValidator = require('./Validator');
const UsersValidator = require('./Validator/users/index');
const UserService = require('./Services/Postgres/UserService');
require('dotenv').config();

const init = async () => {
  const usersService = new UserService();
  const notesService = new NotesService();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: true,
  });

  await server.register([{
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  },

  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  }]);

  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();