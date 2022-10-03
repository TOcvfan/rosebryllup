const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = new express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');
const guests = require('./Componenter/Guests')
const register = require('./Componenter/register');
const signin = require('./Componenter/signin');
const hentlisteemne = require('./Componenter/hentlisteemne')
const regnskab = require('./Componenter/regnskab');
const nyliste = require('./Componenter/nyliste');
const regnskabPost = require('./Componenter/regnskabpost');
const fjerntabel = require('./Componenter/fjernTabel');
const table = require('./Componenter/table');
const tablePost = require('./Componenter/tablePost');
const fjern = require('./Componenter/fjern');
const hentguest = require('./Componenter/hentguest');

const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const knex = require('knex');
const knexDb = knex({
  client: 'mysql',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    port: process.env.DB_PORT,
    database: process.env.DB
  }
});

const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const db = bookshelf(knexDb);
db.plugin(securePassword);

const User = db.Model.extend({
  tableName: 'bruger',
  hasSecurePassword: true
});


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

app.get('/', (req, res) => {
  res.send(`App is running on ${process.env.PORT}`);
  window.location.replace("https://christian.hammervig.dk");
})

const strategy = new JwtStrategy(opts, (payload, next) => {
  User.forge({ role: payload.role, id: payload.id }).fetch().then(res => {
    next(null, res);
  });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const auth = passport.authenticate('jwt', { session: false });

//bruger

//app.post('/newuser', async (req, res) => { register.handleRegister(req, res, User, jwt, dotenv, knexDb) });//opret bruger

app.post('/login', (req, res) => { signin.handleSignin(req, res, knexDb, bcrypt, jwt, dotenv) });//login

//app.delete('/fjernbruger/:id', auth, (req, res) => { fjern.handleFjern(req, res, jwt, knexDb) });

//gæster

app.patch('/guests/:id', auth, (req, res) => { guests.handleGuests(req, res, jwt, dotenv, knexDb) });//rediger gæster

app.get('/guest/:id', auth, (req, res) => { hentguest.handleGuest(req, res, knexDb) });//hent gæst

app.post('/nyguestpost', auth, (req, res) => { regnskabPost.handleRegnskabGuestPost(req, res, knexDb, jwt, dotenv, 'guests') });//ny række gæster

app.delete('/fjernguest/:id', auth, (req, res) => { fjern.handleFjern(req, res, jwt, knexDb) });//ny række

//regnskab

app.post('/nyregnskabpost', auth, (req, res) => { regnskabPost.handleRegnskabGuestPost(req, res, knexDb, jwt, dotenv, 'regnskab') });//ny række regnskab

app.patch('/regnskab/:id', auth, (req, res) => { regnskab.handleRegnskab(req, res, knexDb, jwt, dotenv) });//rediger regnskab

app.delete('/fjernregnskab/:id', auth, (req, res) => { fjern.handleFjern(req, res, jwt, knexDb) });//ny række

//regnskab og liste

app.get('/tabel/:name/:id', auth, (req, res) => { hentlisteemne.handleListeEmne(req, res, knexDb, jwt) });//hent liste emne

app.get('/hentliste/:name', auth, (req, res) => { table.handleTable(req, res, knexDb, jwt) });//hent liste

//lister

app.post('/egenliste', auth, (req, res) => { tablePost.handleTablePosts(req, res, knexDb, jwt, dotenv) });//ny række

app.post('/nyliste', auth, (req, res) => { nyliste.handleNyListe(req, res, knexDb, jwt) });//opret liste

app.delete('/fjernlisteemne/:id', auth, (req, res) => { fjern.handleFjern(req, res, jwt, knexDb) });//ny række

app.delete('/fjenliste', auth, (req, res) => { fjerntabel.handleFjernTabel(req, res, knexDb, dotenv) });//ny række


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
});