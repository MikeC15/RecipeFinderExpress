require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

//database check
require('./db/db');

app.use(session({
    secret: "this is a random secret string",
    resave: false,
    saveUninitialized: false
}));

//middleware
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

//controllers check
const usersController = require('./controllers/users.js');
app.use('/auth', usersController);

const myIngredientsController = require('./Controllers/myIngredients.js');
app.use('/myIngredients', myIngredientsController);




// home page
app.get('/', (req, res) => {
    console.log(req.session, 'home route')
    res.send("HELLOOOO")
});




app.listen(process.env.PORT, () => {
    console.log('server listening on port', 8000);
});
