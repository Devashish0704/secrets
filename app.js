require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const  mongoose  = require("mongoose");
const md5 = require ("md5");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})


app.route("/register")
    .get(function (req, res) {
        res.render("register")
    })
    .post(function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
})

app.route("/login")
    
    .get(function(req, res){
        res.render("login");
    })
    .post(function(req, res){
        const username = req.body.username;
        const password = md5(req.body.password);
        User.findOne(
                {email: username},
                function(err, foundUser){
                    if (err) {
                        console.log();
                    } else {
                        if (foundUser) {
                            if (foundUser.password === password){
                                res.render("secrets")
                            }
                        } 
                    }
                }
            )
      
    })


app.listen(3000, function () {
    console.log("server started on port 3000");
})