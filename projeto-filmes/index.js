//Carregando modules------------------------------------------------
    import express from "express";
    import ExpressHandlebars from "express-handlebars";
    import bodyParser from "body-parser";
    import loginCad from "./routes/loginCad.js"
    import list from "./routes/list.js";
    import path from "path";
    import session from "express-session";
    import flash from "connect-flash";
    import dotenv from "dotenv/config.js"; 
    import passport from "passport";
    import configAuth from "./config/auth.js";

    const app = express();//referencia para usar o express
    configAuth(passport);
    
//Config------------------------------------------------
    //Sessão
        app.use(session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());

    //Middleware
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash("success_msg");//res.locals é para criar uma variável global
            res.locals.error_msg = req.flash("error_msg");//variáveis para mensagens
            res.locals.user = req.user || null; // variavel do usuario logado
            res.locals.error = req.flash("error");
            next();//para não prender a requisição aqui
        });

    //Template Engine
        app.engine("handlebars", ExpressHandlebars.engine({defaultLayout: "main"})); //definindo essa engine como main
        app.set("view engine", "handlebars");

    //Body-parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Public
        app.use(express.static(path.join("./public")));//usar arquivos estaticos (css, js ...)

//Rotas------------------------------------------------
    app.get("/", function(req, res){
        res.redirect("/watchlist/login");
    });
    app.use("/watchlist", loginCad);
    app.use("/usuario", list);

//Outros------------------------------------------------
    const PORT = 8080;
    app.listen(PORT, function(){
        console.log("servidor rodando");
    });//conectar no localhost