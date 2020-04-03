// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"))

// habilitar o body do formulário
server.use(express.urlencoded({extended: true}))

// conexão com o bando de dados POSTGRES
// const Pool = require('pg').Pool
// const db = new Pool({
//     user: 'postgres',
//     password: '123456',
//     host: 'localhost',
//     port: 5432,
//     database: "doe"
// })

// conexão com o banco de dados MYSQL
const mysql = require('mysql');
const db = mysql.createConnection({
  host: "mysql669.umbler.com",
  port: 41890,
  user: "doeadmin",
  password: "info1978",
  database: "doe",
});


// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurando a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM doe.donors;", function(err, result){
        if (err) return res.send(err) // "Erro ao tentar conectar no banco de dados."
        console.log(result)
        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
    
})

// pegar dados do formulário
server.post("/", function(req, res){
    const name = req.body.name;
    const email = req.body.email; 
    const blood = req.body.blood; 

    if (name == "" || email == "" || blood == "" )
        return res.send("Todos os campos são obrigatórios!")
    
    // adicionar valores no array
    // const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1,$2,$3)`
    // const values = [name, email, blood]

    const query = "INSERT INTO donors (name, email, blood) VALUES ('" + name + "','" + email + "','" + blood + "')"
    
    console.log(query)
    
    db.query(query, function(err){
        
        // fluxo de erro        
        if (err) return res.send(err) //"Erro ao inserir os dados no banco."
        
        // fluxo correto
        return res.redirect("/")
    })
    
})

// ligar o servidor
server.listen(3000, function(){
    console.log("Servidor iniciado.")
})


