const express = require('express');
const router = express.Router();
const MyIngredients = require("../models/myIngredients");
const User = require("../models/users");


//ROUTES

//index route  need to make sure it finds only the CURRENT users groups
router.get('/', async (req, res) => {
    console.log('hello')
    try {
        console.log('Session:', req.session)
        console.log('Username:', req.session.username)

        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'myIngredients',
                    match: { _id: req.params.id }
                })
            .exec()
                console.log("FOUNDUSER", foundUser)
        // const foundMyIngredients = await MyIngredients.find({});
        if(foundUser){
            res.statusCode = 201
            res.json({user: foundUser})
        }else{res.send({status: 404})}
    //     res.render('groups/index.ejs', {
    //         myIngredients: foundUser.myIngredients,
    //         username: req.session.username,
    //         message: req.session.message,
    //         logged: req.session.logged
    //     });
    } catch (err) {
        res.send(err);
    }
});


//new route  DONE
// router.get('/new', (req, res) => {
//     res.render('groups/new.ejs');
// });


//create route DONE and pushes group into current users groups array
router.post('/', async (req, res) => {
    console.log('IN POST TO MYINGREDIENTS')
    console.log('REQBODY:', req.body)
    try{
        const findUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'myIngredients',
                    match: { _id: req.params.id }
                })
            .exec()
        const createIngredient = await MyIngredients.create(req.body)
        findUser.myIngredients.push(createIngredient);
        await findUser.save();
        res.send(findUser);
    } catch (err) {
        console.log(err)
        res.send("Please go back and fill in all required fields.");
    }
});


//show route  WORKING
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'myIngredients',
                    match: { _id: req.params.id }
                })
            .exec()
        // below adds current group to req
        req.session.myIngredients = foundUser.myIngredients[0]
        // console.log(`req.session`, req.session)
        // console.log(`req.session.GROUP`, req.session.group)
        // res.render('groups/show.ejs', {
        //     user: foundUser,
        //     group: foundUser.groups[0],
        // });
        // console.log(foundUser)
        res.send(req.session.myIngredients)
    } catch (err) {
        res.send(err);
    }
});


//edit route
// router.get('/:id/edit', async (req, res) => {
//     try {
//         const allUsers = await User.find({})
//         const foundGroupUser = await User.findOne({ 'groups': req.params.id })
//             .populate({ path: 'groups', match: { _id: req.params.id } })
//             .exec()
//         res.render('groups/edit.ejs', {
//             group: foundGroupUser.groups[0],
//             users: allUsers,
//             groupUser: foundGroupUser
//         });
//     } catch (err) {
//         res.send(err);
//     }
// });


//update route
router.put('/:id', async (req, res) => {
    try {
        const updatedMyIngredient = await MyIngredients.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const foundUser = await User.findOne({ 'myIngredients': req.params.id })
            .populate(
                {
                    path: 'myIngredients',
                    match: { _id: req.params.id }
                })
            .exec()
        res.send(foundUser);
    } catch (err) {
        console.log(err)
        res.send("Please go back and fill in all required fields.");
    }
});


// destroy route DONE
router.delete('/:id', async (req, res) => {
    try {
        const deleteMyIngredients = await MyIngredients.findByIdAndRemove(req.params.id);
        const findUser = await User.findOne({ 'username': req.session.username });
        // console.log(findUser, ' found user')
        findUser.myIngredients.remove(req.params.id);
        await findUser.save()
        console.log(findUser)
        res.send("deleted")
    } catch (err) {
        res.send(err);
    }
});




module.exports = router;
