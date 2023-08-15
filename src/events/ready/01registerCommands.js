const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`deleted command: ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`command ${name} was edited`);
        }
        console.log(`command ${name} is correct`);
      } else {

        if (localCommand.deleted) {
          console.log(`registration of command ${name} was skipped`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`command ${name} was created`);
      }
    }
  } catch (error) {
    console.log(`error while registering commands ${error}`);
  }
};

