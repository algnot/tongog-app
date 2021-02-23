let express = require('express');
let app = express();
let parser = require('body-parser');
let session = require('express-session');
let url = require('url');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'public/img/user/' })

let MongoClient = require('mongodb').MongoClient;
const { get } = require('http');
let connectionString = 'mongodb+srv://tongog-app:iwuUWbOI7U3Dl6Ra@cluster0.qhlux.mongodb.net///tongog-app?retryWrites=true&w=majority'; 

let PORT = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.set('view engine','ejs');
app.use(session({secret: 'mai-bok-rog'}));


MongoClient.connect(connectionString, {useUnifiedTopology: true} , function (err,client){
    if (err) return console.error(err);
    let db = client.db('tongog-app');
     
    app.get('/', (req,res) => {
        if(!req.session.sessionLoginKey){
            // not login
            res.redirect('/login');
        } else {
            // user login
            res.status(200);
            res.render(__dirname + '/private/index.ejs');
        }
    })
    
    app.get('/register', (req,res) => {
        if(!req.session.sessionLoginKey){
            // not login
            res.status(200);
            res.render(__dirname + '/private/register.ejs');
        } else {
            // user login
            res.redirect('/');
        }
    })
    
    app.post('/register', upload.single('profile-image') , (req,res) => {
        if(req.body.password == req.body.confirm_password){
            db.collection('user-database').find({email : req.body.email}).toArray()
            .then(result => {
                if(result.length == 0){
                    db.collection('user-database').find({username : req.body.username}).toArray()
                    .then(result=>{
                        if(result.length == 0){
                            var randomstring = Math.random().toString(36).slice(-14);
                            let userData = { 'user-key': randomstring, email:req.body.email , username : req.body.username , password: req.body.password};
                            db.collection('user-database').insertOne(userData)
                            .then(result => {
                                fs.rename('public/img/user/'+req.file.filename,'public/img/user/'+req.body.username+'.jpg', function(err) {
                                    res.status(200);
                                    res.render(__dirname + '/private/bypassLogin.ejs', {user:userData}); 
                                });
                            })
                            .catch(err => {
                                res.status(500);
                                res.render(__dirname + '/public/500.ejs'); 
                            })
                        } else {
                            res.status(400);
                            res.render(__dirname + '/public/400.ejs'); 
                        }
                    })
                    .catch(err =>{
                        res.status(500);
                        res.render(__dirname + '/public/500.ejs'); 
                    })
                } else {
                    res.status(400);
                    res.render(__dirname + '/public/400.ejs');  
                }           
            })
            .catch(err => {
                res.status(500);
                res.render(__dirname + '/public/500.ejs'); 
            })  
        } else {
           res.redirect('/');  
        }
    })

    app.get('/checkEmail' , (req,res) => {
        let checkEmail = url.parse(req.url ,true).query.email;
        db.collection('user-database').find({email:checkEmail}).toArray()
        .then(result => {
            if(result.length==0){
                res.status(200);
                res.json({ status: 'OK' })
            } else {
                res.status(400);
                res.json({ status: checkEmail+' is already exists' })
            }
        })
        .catch(err=>{
            res.status(err.status || 502);
            res.json({ status: 'database error' })
        })
    })

    app.get('/checkUsername' , (req,res)=> {
        let checkUsername = url.parse(req.url ,true).query.username;
        db.collection('user-database').find({username:checkUsername}).toArray()
        .then(result => {
            if(checkUsername.length<5){
                res.status(400);
                res.json({ status: 'The username must contain more than 5 characters!' })
            }else if(result.length==0){
                res.status(200);
                res.json({ status: 'OK' })
            } else {
                res.status(400);
                res.json({ status: checkUsername+' is already exists' })
            }
        })
        .catch(err=>{
            res.status(err.status || 502);
            res.json({ status: 'database error' })
        })
    })

    app.get('/login' , (req,res) => {
        res.status(200);
        res.render(__dirname + '/private/login.ejs');
    })

    app.get('/test' , (req,res) => {
        res.status(200);
        res.render(__dirname + '/private/login/index.ejs');
    })

    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render(__dirname + '/public/500.ejs');
    })
      
    app.use(function(req, res){
        res.status(404);
        res.render(__dirname + '/public/404.ejs');
    })
    
    app.listen(PORT, _ => {
        console.log('You can view your app at http://localhost:8080')
    })

}) 

