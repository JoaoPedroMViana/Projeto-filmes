import Sequelize from 'sequelize';
import dotenv from "dotenv/config.js"; 
import mysql2 from 'mysql2';

//Conecção BD------------------------------------------------
const sequelize = new Sequelize(process.env.NAME, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
    dialectModule: mysql2,
    port: process.env.PORT,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false 
        }
      },
});

sequelize.authenticate().then(function(){
    console.log("conectado com sucesso");
}).catch(function(err){
    console.log("erro: "+err);
});//verificar conexão

export {Sequelize, sequelize};