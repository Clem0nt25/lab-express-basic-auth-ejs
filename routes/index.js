const User = require("../models/User.model");
const router = require("express").Router();
const bcryptjs = require("bcryptjs")

const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/



/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");

});


/* GET sign up page */
router.get("/signup", (req, res, next) => {
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
        res.render('signup', {
          errorMessage: 'Password is not strong enough',
          data: { username: req.body.username },
        })
      }
    } else {
      res.render('signup', {
        errorMessage: 'Username already in use',
        data: { username: req.body.username },
      })
    }
  } catch (error) {
    console.log(error)
  }
})





module.exports = router;
