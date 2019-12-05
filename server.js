require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
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
app.use(bodyParser.json({ extended: true }));


var whitelist = ['http://localhost:3000']
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

//controllers check
const usersController = require('./controllers/users.js');
app.use('/auth', usersController);

const myIngredientsController = require('./controllers/myIngredients.js');
app.use('/myIngredients', myIngredientsController);




// home page
app.get('/', (req, res) => {
    console.log(req.session, 'home route')
    res.send("HELLOOOO")
});

app.listen(process.env.PORT, () => {
    console.log('server listening on port', 8000);
});