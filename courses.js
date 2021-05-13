var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var app = express();

app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
    host: 'localhost',
    user: 'ala123',
    password: 'ala123',
    database: 'ala123',
    port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));


app.get('/', function(req, res){    
    res.render('start');
});

app.get('/list', function(req, res){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM courses', function(err,rows){
            var coursesList = rows;
            res.render('list',{coursesList:coursesList});
        });
    });
});


app.get('/add', function(req, res){   
    res.render('add');
});

app.post('/add', function(req, res){
    var cours={
        name: req.body.name,
        note: req.body.note        
    }
    if(cours.name==''){
        var message='Podaj nazwę';
        res.render('add',{message:message});
        return;
    }
    console.log(cours)
    req.getConnection(function(error, conn){
        conn.query('INSERT INTO courses SET ?',cours, function(err,rows){
            if (err) {
                var message='Wystąpił błąd';
            }else{
                var message='Dodano';
            }
            res.render('add',{message:message});
        });
    });
});

app.get('/edit/(:id)', function(req, res){
    var idcours=req.params.id;
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM courses WHERE id='+idcours, function(err,rows){
            res.render('edit',{
                id: idcours,
                name: rows[0].name,
                note: rows[0].note
            });
        });
    });
});

app.post('/edit/(:id)', function(req, res){
    var idcours=req.params.id;
    var cours={
        name: req.body.name,
        note: req.body.note,
        data_dodania: Date()
    }
    req.getConnection(function(error, conn){
        conn.query('UPDATE courses SET ? WHERE id='+idcours, cours, function(err,rows){
            if (err) {
                var message='Wystąpił błąd';
            }else{
                var message='Zmieniono';
            }
            res.render('edit',{
                id: idcours,
                name: req.body.name,
                note: req.body.note,
                message:message
            });
        });
    });
});


app.get('/delete/(:id)', function(req, res){
    var idcours=req.params.id;
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM courses WHERE id='+idcours, function(err,rows){
            res.render('delete',{
                id: idcours,
                name: rows[0].name,                
            });
        });
    });
});

app.post('/delete/(:id)', function(req, res){
    var idcours=req.params.id;    
    req.getConnection(function(error, conn){
        conn.query('Delete FROM courses WHERE id='+idcours, function(err,rows){
            if (err) {
                var message='Wystąpił błąd';
            }else{
                var message='Usunięto rekord';
            }
            res.render('delete',{
                id: idcours,             
                message:message
            });
        });
    });
});

app.listen(1337);