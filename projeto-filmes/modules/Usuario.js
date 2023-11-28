import * as Db from "./Db.js"

//Tabela Usuários------------------------------
const Usuarios = Db.sequelize.define("usuarios", {
    id: {
        type: Db.Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Db.Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Db.Sequelize.STRING,
        allowNull: false
    }
});//criar tabela
// Usuarios.sync({force: true}); 

// Usuarios.create({
//     nome: "joão Pedro",
//     senha: "12345"
//  }); 

export default Usuarios;