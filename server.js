// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"))

// habilitar o body do formulário
server.use(express.urlencoded({extended: true}))

// conexão com o bando de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'doeadmin',
    password: 'info1978',
    host: 'mysql669.umbler.com',
    port: 41890,
    database: "doe"
})


// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurando a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro ao tentar ler os dados no banco.")

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
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1,$2,$3)`
    const values = [name, email, blood]

    db.query(query, values, function(err){
        
        // fluxo de erro
        if (err) return res.send("Erro ao inserir os dados no banco.")
        
        // fluxo correto
        return res.redirect("/")
    })

    
})

// ligar o servidor
server.listen(3000, function(){
    console.log("Servidor iniciado.")
})


