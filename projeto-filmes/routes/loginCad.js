//Carregando modules------------------------------------------------
    import express from "express";
    import Usuarios from "../modules/Usuario.js";
    import bcrypt from "bcryptjs"
    const router = express.Router();

//Rotas Login-------------------------------------------------------
    router.get("/login", function(req, res){
        //res.send("ola");//so pode ser usado uma vez na rota
        res.render("form_login");
        //verificar se o user ja existe, se sim vai direto pro watchlist
    })

    router.post("/cadastro", function(req, res){
        const nome = req.body.usuario;
        const senha = req.body.senha;
        const confSenha = req.body.conf_senha;
        const errorsSenha = [];
        const caracteresEspeciais = /[ ?/;.,|!#$%¨^~:{}\[\]`&*()'"\\+£§¢¬=ãÃõÕéÉáÁâÂêêôÔúÚùÙÒòíÍìÌçàÀÈèóÓûÛüÜ-]/g;

         //Verificação senha
            if(caracteresEspeciais.test(senha)) errorsSenha.push({text: "Senha com caracter inválido! Apenas _(underline) e @(arroba) são aceitos."});
            if(senha.length <= 7) errorsSenha.push({text: "Senha curta! são necessários no mínimo 8 caracteres."});
            if(!/[@_]/g.test(senha)) errorsSenha.push({text: "Senha não contem @ ou _."});
            if(!/[0-9]/g.test(senha)) errorsSenha.push({text: "Senha não contem números."});
            if(!/[A-Z]/g.test(senha)) errorsSenha.push({text: "Senha não contem letras maiúsculas."});
            if(!/[a-z]/g.test(senha)) errorsSenha.push({text: "Senha não contem letras minúsculas."});
            if(senha !== confSenha) errorsSenha.push({text: "Senhas diferentes."});       

        Usuarios.findOne({where: {'nome': nome}}).then(function(usuarios){
            const errorsName = [];
            //Verificando se usuário já existe
                if(usuarios != null || usuarios != undefined){
                    errorsName.push({text: "Nome de usuário já existe."});
                }else{
                    if(caracteresEspeciais.test(nome)) errorsName.push({text: "Nome com caracter inválido! Apenas _(underline) e @(arroba) são aceitos."});
                // res.redirect("/watchlist/login");
                    if(nome.length <= 7) errorsName.push({text: "Nome com menos de 8 caracteres."});
                }
            //Verificação de erros
                if(errorsName.length > 0 || errorsSenha.length > 0){
                    res.render("forms/form_cad", {errorsName: errorsName, errorsSenha: errorsSenha, nome: nome, senha: senha, confSenha: confSenha});
                }else{
                    bcrypt.genSalt(10, function(erro, salt){
                        bcrypt.hash(senha, salt, function(erro, hash){
                            if(erro){
                                req.flash("error_msg", "Erro ao salvar usuário, tente novamente")
                                res.redirect("/watchlist/cadastro");
                            }

                            Usuarios.create({ 
                                nome: nome,
                                senha: hash
                            }).then(function(){
                                req.flash("success_msg", "Usuário criado com sucesso!");//declara o valor Usuário criado com sucesso! no scopo global 
                                res.redirect("/watchlist/login");
                            }).catch(function(err){
                                req.flash("error_msg", "Ocorreu um erro ao criar o usuário, tente novamente!");
                                res.redirect("/watchlist/cadastro");
                            });
                        })
                    })
                    
                }
        });
         
    });//rota, parametros é usando /: na rota e escrever o nome do parametro
        // "/rota/:parametro" para acessar esse parametro: req.params.parametro

//Rota Cadastro-----------------------------------------------------
    router.get("/cadastro", function(req, res){
        res.render("forms/form_cad");
    });


export default router;//apagar e tentar