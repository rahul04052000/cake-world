var express = require('express');
const bodyParser = require("body-parser");
const sessions = require('express-session');
var mysql = require("mysql");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized: true,
    resave: false
}));


var db = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "", // my password
    database: "cake"
});
db.connect(function (error) {
    if (error) {
        console.log(error);;
    }
    else
        console.log("my sql connected");
})
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get("/signup", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})
//register
app.post("/signup", function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    var surname = req.body.surname;
    var Email = req.body.Email;
    var phone = req.body.phone;
    var address = req.body.address;
    var state = req.body.state;
    var country = req.body.country;
    var pass = req.body.pass;
    if (name.length > 0 && surname.length > 0 && Email.length > 0 && pass.length > 0) {
        var sql = `INSERT INTO cakeworld (name,surname,email,phone,address,state,country,password) VALUES('${name}','${surname}','${Email}','${phone}','${address}','${state}','${country}','${pass}')`;

        db.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                // using userPage function for creating user page
                res.sendFile(__dirname + "/index.html");

            };


        });
    }
    else {
        res.redirect("/signup")
    }




});
app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html")
})

app.post("/dashbord", function (req, res) {
    var email = req.body.email;
    var pass = req.body.pass;

    db.connect(function (err) {
        if (err) {
            console.log(err);
        };
        //get user data from MySQL database
        db.query(`SELECT * FROM cakeworld WHERE email = '${email}' AND password = '${pass}'`, function (err, result) {
            if (err) {
                console.log(err);
            }

            // creating userPage function to create user page
            function userPage() {
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    name: result[0].name,
                    email:result[0].email,
                    // get MySQL row dataa
                    // email: email,
                    // password: password 
                };

                res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Login and register form with Node.js, Express.js and MySQL</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
    <div class="container my-4">
    <div class="jumbotron">
        <h1 class="display-4"> HELLO <strong>${req.session.user.name}<strong> </h1>
        <p> thanku for connecting whith us : </p>
        <p>you resistered email id is: ${req.session.user.email}</p>
        <a href="/">Log out</a>
       
        
       
    </div>
</div>
    </body>
    </html>
    `);

            }

            if (Object.keys(result).length > 0) {
                userPage();
            } else {
                // res.sendFile(__dirname + '/failLog.html');
                // res.send(<a href ="/"></a>)
                res.redirect("/login");
            }

        });
    });
});

app.listen(3000, function () {
    console.log("port 3000");
});