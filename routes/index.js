const User = require("../models/User.model");
const router = require("express").Router();
const bcryptjs = require("bcryptjs")
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/



/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");

});


/* GET sign up page */
router.get("/signup",isLoggedOut, (req, res, next) => {
  res.render("signup");
});

// Post route for sign up button
router.post('/signup', async (req, res, next) => {
  try {
    const potentialUser = await User.findOne({ username: req.body.username })
    if (!potentialUser) {
      if (pwdRegex.test(req.body.password)) {
        const salt = bcryptjs.genSaltSync(13)

        const passwordHash = bcryptjs.hashSync(req.body.password, salt)

        await User.create({ username: req.body.username, passwordHash})
        res.send({username: req.body.username, passwordHash})
      } else {
        res.render('signup')
        console.log("Password not good enough")
      }
    } else {
      res.render('signup')
      console.log('User exists')
    }
  } catch (error) {
    console.log(error)
  }
})



// log in get route
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("login");
});


// post route for log in 
router.post('/login', async (req, res, next) => {

  console.log('SESSION =====> ', req.session);

  try {
    const userfound = await User.findOne({username: req.body.username})
    
    // checking if User queried from DB is not null
    if(!!userfound) {

      if(bcryptjs.compareSync(req.body.password, userfound.passwordHash)) {
        
        req.session.user = { username: userfound.username }
        res.redirect("signup")
      } else {
        res.render('login', { errorMessage: 'Incorrect password.' });
      } 

    } else {
        res.render('login', { errorMessage: 'Incorrect username.' });
    }
    
  } catch (error) {
    console.log(error)
    
  }
})




/* GET home page */
router.get("/home",isLoggedIn, (req, res, next) => {
  res.render("home");
});



/* GET main page */
router.get("/main", isLoggedIn , (req, res, next) => {
  res.render("main", {userInSession: req.session.user});
});

/* GET private page */
router.get("/private",isLoggedIn , (req, res, next) => {
  res.render("private", {userInSession: req.session.user});
});









module.exports = router;
