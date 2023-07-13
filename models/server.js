let express = require ("express");
let sha1 = require("sha1");
let session = require ("express-session")
let cookie = require ( "cookie-parser")

class Server {
    constructor (){
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();

    }

    middlewares(){
        //Paginas estaticas
        this.app.use(express.static('public'));
        //View engine
        this.app.set('view engine', 'ejs');
        //sesiones//////////////////
        this.app.use(cookie());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
        ////////////////////////////



    }

    routes (){
        this.app.get("/hola",(req, res) => {
          //session
          if (req.session.user){
            if (req.session.rol == '11'){
              res.send("<h1 style='color: blue;'>Iniciaste como administrador</h1>");
            }
            else{ 
              res.send("<h1 style='color: blue, '>Iniciaste como cliente</h1>");
            }

          }
          else {
            res.send("<h1 style='color: blue;'>ERROR NO HAS INICIADO SESION!!!</h1>");
          }
        });


        
        this.app.get('/login', (req, res) => {
          let Usuario = req.query.Usuario;
          let Contrasena = req.query.Contrasena;

          let passSha1 = sha1(Contrasena);



          let mysql = require ( 'mysql');

          let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "12345",
            database: "escuela" 
          });
          
          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            let sql = "select * from Usuarios where Usuario = '" + Usuario + "'";
            con.query(sql, function (err, result) {
              if (err) throw err;
                 if (result.length  > 0 )
                     if (result[0].Contrasena == passSha1){
                      ///////////////////session////////////
                      let user = {
                        nam: Usuario, 
                        psw: Contrasena,
                        rol: result[0].rol
                      };
                      req.session.user = user;
                      req.session.save();
                      /////////////////////////////////////////////               
                        res.render("Inicio", { nombre: result[0].Usuario, rol: result[0].rol})
                    }
                      else
                        res.render( "Login", {  error: "Contrasena incorrecta"});
                  else
                      res.render("Login" , {error: "Usuario no existe!!!"});
            });
          });
          


        });


//////////////////////DAR DE BAJA ALUMNOS/////////////////////////////




////////REGISTRAR////////////////
        this.app.get("/Registrar", (req, res) => {
            let mat = req.query.mat;
            let nombre = req.query. nombre;
            let cuatri = req. query. cuatri;
            let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO alumno  VALUES ("+mat+",'"+nombre+"','"+cuatri+"') ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("Registrado", {mat:mat , nombre: nombre , cuatri: cuatri});
    console.log("1 record inserted");
  });
});
        });


        this.app.get("/RegistrarCursos", (req, res) => {
            let id_curso = req.query. id_curso;
            let nombre = req.query. nombre;
            let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO curso  VALUES ("+id_curso+",'"+nombre+"') ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("RegistrarCursos", { nombre: nombre , id_curso: id_curso});
    console.log("1 record inserted");
  });
});
        });
        
        this.app.get("/inscrito", (req, res) => {
          let inscrito = req.query. inscrito;
          let nombre = req.query. nombre;
          let mysql = require('mysql');

let con = mysql.createConnection({
host: "localhost",
user: "root",
password: "12345",
database: "escuela"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
let sql = "INSERT INTO inscrito  VALUES ("+inscrito+",'"+nombre+"') ";
con.query(sql, function (err, result) {
  if (err) throw err;
  res.render("inscrito", { nombre: nombre , inscrito: inscrito});
  console.log("1 record inserted");
});
});
      });

    }

    listen(){
        this.app.listen(this.port,() =>{
            console.log("http://127.0.0.1:" + this.port);
        });

    }

    }

    module.exports = Server;