import Usuarios from "../modules/Usuario.js";
import bcrypt from "bcryptjs";
import local from "passport-local";

const localStrategery = local.Strategy;


// precisa chamar essa função no index.js passando o passport


export default function configAuth(passport){
    passport.use(new localStrategery({usernameField: 'usuario', passwordField: 'senha'}, function(usuario, senha, done){

        Usuarios.findOne({where: {'nome': usuario}}).then(function(data){
            if(data == null){
                console.log("usuario null")
                return done(null, false, {message: "Este usuário não existe"});
            }

            bcrypt.compare(senha, data.senha, function(erro, ok){
                if(ok){
                    console.log("senha ok")
                    return done(null, data.get({plain: true}));
                }else{
                    console.log("senha nao ok")
                    return done(null, false, {message: "Senha incorreta"});
                }
            })


        })

    }))

    passport.serializeUser(function(usuario, done){
        console.log("serialize ok");
        done(null, usuario.id);
    })

    passport.deserializeUser(function(id, done){
        Usuarios.findByPk(id).then(function(usuario){
            done(null, usuario.get({plain: true}));
        }).catch(function(err){done(err)})
    })
}
