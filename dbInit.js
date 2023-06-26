const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

const Warns = require('./models/warns')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const warns = await Warns.findAll();
    console.log(warns);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);

