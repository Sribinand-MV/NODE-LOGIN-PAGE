const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const nocache = require('nocache');
const app = express();


const validEmail = "sribi@gmail.com";
const validPassword = "sribi@123";


app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(nocache());

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login');
    }
});


app.post('/verify', (req, res) => {
    const { email, password } = req.body;

 
    if (!isValidEmail(email)) {
        return res.render('login', { emailError: "Please enter a valid email address." });
    }

 
    if (password.length < 6) {
        return res.render('login', { passwordError: "Password must be at least 6 characters long." });
    }

  
    if (email === validEmail && password === validPassword) {
        req.session.user = email;  // 
        req.session.passwordwrong = false;
        return res.redirect('/home');
    } else {
      
        let error = "";
        if (email !== validEmail) {
            error = "The email you entered is incorrect.";
        } else if (password !== validPassword) {
            error = "The password you entered is incorrect.";
        }
        return res.render('login', { error });
    }
});

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { email: req.session.user });
    } else {
        res.redirect('/');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.listen(4000, () => console.log('Server running on port 4000'));
