//Carregando modules------------------------------------------------
    import express from "express";//importação do 
    import Usuarios from "../modules/Usuario.js";
    const router = express.Router();
    import Lista from "../modules/Lista.js";
    import dotenv from "dotenv/config.js"; 
    import passport from 'passport'
import Listas from "../modules/Lista.js";

router.post('/watchlist', function(req, res, next){
    let nome = req.body.usuario;
    passport.authenticate('local', {
        successRedirect: `/usuario/${nome}/watchlist`,
        failureRedirect: '/watchlist/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/:usuario/watchlist', function(req, res){
    if(req.user != null){
        //select no banco de dados ordenando id descendente
        // String Json => objeto js esse segundo parametro leva coisas para o front  
        Lista.findAll({attributes: ['id_filmes'], where:{'id_usuario': req.user.id}}).then(function(data){
            if(data[0] != null){
                let listaIdsFilmes = JSON.stringify(data);
                let listaIdsFilmes_json = JSON.parse(listaIdsFilmes);
                const arrayIds = [];
                for(let i of listaIdsFilmes_json){
                    arrayIds.push(i.id_filmes);
                }
                
                const options = {
                    method: 'GET',
                    headers: {
                    accept: 'application/json',
                    Authorization: process.env.AUTHORIZATION
                    }
                };
                
                const fetchMovie = async (id, arrayIds) => {
                    try {
                    const response = await fetch(process.env.MOVIES+arrayIds[id]+"?language=pt-Br", options);
                    if (!response.ok) {
                        console.log("erro");
                    }
                    const data = await response.json();
                    return data;
                    } catch (error) {
                        console.error(error+" ERRO NO FETCH");
                    }
                };
                
                const filmes = [];
                for(let id = 0; id < arrayIds.length; id++){

                    fetchMovie(id, arrayIds).then(function(data){filmes.push({'id': data.id, 'title': data.title, 'poster_path': data.poster_path, 'runtime': data.runtime, 'descricao': data.overview})}).then(function(){
                        
                        if(id == arrayIds.length -1){
                            
                            setTimeout(function() {
                                let tempoTotal = 0;
                                const quantFilmes = filmes.length;
                                for(let e of filmes){
                                    tempoTotal += e.runtime;
                                }
                                let horasMinutos = {
                                    'horas': Math.trunc(tempoTotal / 60),
                                    'minutos': tempoTotal % 60
                                }
                                res.render("list/watchlist", { filmes: filmes, tempoTotal: horasMinutos, quantFilmes: quantFilmes});
                            }, 1300);
                        }
                    })
                }
            }else {
                res.render("list/watchlist", {tempoTotal: {'horas': 0, 'minutos': 0}, quantFilmes: 0, mensagem: "Sua watchlist está vazia"})
            }     
        });
        

      
    }else{
        res.render("list/watchlist", {tempoTotal: {'horas': 0, 'minutos': 0}, quantFilmes: 0, mensagem: "Faça o login para acessar sua watchlist"})
    }

});

//post não consegue entrar digitando na barra de url, apenas as get podem ser acessadas pela url

router.post("/:usuario/search/:filme", function(req, res){
    const nomeFilme = req.body.searchFilms;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.AUTHORIZATION
        }
      };
      fetch(process.env.SEARCH+nomeFilme+'&include_adult=false&language=en-US&page=1', options)
        .then(response => response.json())
        .then(response => { 
            const listaIds = [];
            for(let i in response.results){
                listaIds.push(response.results[i]);
            }
            res.render("list/search", {filmes: listaIds});
        }).catch(err => {console.error(err); res.render("list/search")});
});

router.post("/search/add", function(req, res){//talvez mudar isso para um js puro no front pegando o id e trazendo o valor para o back
    if(req.user != null){
        const valorId = req.body.valorId;
        Lista.findOne({where: {
            id_filmes: valorId
        }}).then(function(data){
            console.log(data);
            if(data != null){
                req.flash("error_msg", "O filme já está em sua watchlist!");
                res.redirect(`/usuario/${req.user.nome}/watchlist`);
            }else{
                Lista.create({
                    id_filmes: valorId,
                    id_usuario: req.user.id,
                }).then(function(){
                    req.flash("success_msg", "Filme adicionado a watchlist!");
                    res.redirect(`/usuario/${req.user.nome}/watchlist`);//fazer alguma coisa para carregar a pagina com os filmes dnv
                }).catch(function(err){
                    req.flash("error_msg", "Erro ao adicionar o filme em sua watchlist!");
                    res.redirect(`/usuario/${req.user.nome}/watchlist`);
                });
            }
        })
    }else{
        req.flash("error_msg", "Faça o login para adicionar filmes a sua watchlist!");
        res.redirect("/watchlist/login");
    }
});

router.get("/logout", function(req, res){
    req.logout(function(err){
        req.flash("success_msg", "Logout");
        res.redirect("/watchlist/login");
    });
});

router.post("/delete", function(req, res){
    let valorId = req.body.valorId;
    Listas.destroy({where: {
        'id_usuario': req.user.id,
        'id_filmes': valorId
    }}).then(function(){
        req.flash("success_msg", "Filme excluído da watchlist!");
        res.redirect(`/usuario/${req.user.nome}/watchlist`);
    }).catch(function(err){
        req.flash("error_msg", "Erro ao excluir filme");
        res.redirect(`/usuario/${req.user.nome}/watchlist`);
    });
});

export default router;