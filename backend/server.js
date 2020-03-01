// Configurando o servidor
const express = require("express");
const server = express();

// Configurando o servidor para apresentar arquivos estáticos
server.use(express.static("../frontend/public"));

// Habilitando body do formulário
server.use(express.urlencoded({ extended: true }));

// Configurando a conexão com o banco de dados
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "0000",
  host: "localhost",
  port: 5432,
  database: "doe"
});

// Configurando a template engine (nunjucks)
const nunjucks = require("nunjucks");
nunjucks.configure("../frontend", {
  express: server,
  noCache: true
});

// Configurando a apresentação da página
server.get("/", (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.send("Erro no banco de dados.");

    const donors = result.rows;

    return res.render("index.html", { donors });
  });
});

// Pegando dados do formulário
server.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  } /* return para o fluxo da função, o programa não
  passa pela etapa do dabase caso entre no if */

  // Colocando valores dentro do banco de dados
  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)
  `;
  const values = [name, email, blood];

  db.query(query, values, err => {
    // Fluxo de erro
    if (err) return res.send("Erro no banco de dados.");

    // Fluxo ideal
    return res.redirect("/");
  });
});

// Ligando o servidor e permitindo o acesso na porta 3000
server.listen(3000, () => {
  console.log("Iniciei o servidor");
});
