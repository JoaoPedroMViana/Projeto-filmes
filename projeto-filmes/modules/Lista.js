import * as Db from "./Db.js"

//Tabela Listas------------------------------
const Listas = Db.sequelize.define("listas", {
    id_filmes: {
        type: Db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }
});
// Listas.sync({force: true});

export default Listas;