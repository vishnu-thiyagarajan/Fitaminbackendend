const localStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const UserModel = require('./models/user.model');


passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const user = await UserModel.create({ name: req.body.name, email, password, role: req.body.role._id });
          const resObj = user.toObject();
          resObj.role = req.body.role
          return done(null, resObj);
        } catch (error) {
          done(error);
        }
      }
    )
  );

// ...

passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email }).populate('role').exec();
  
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

// function init(passport, getUserByEmail, getUserById){
//     const authenticateUser = async (email, password, done) => {
//         const user = await getUserByEmail(email);
//         if (user == null){
//             return done(null, false, {message: 'No user with that email exists'})
//         }
//         try{
//             const validate = await user.isValidPassword(password);
//             if (validate){
//                 return done(null, user)
//             } else {
//                 return done(null, false, {message: 'Password Incorrect'})
//             }
//         } catch(e) {
//             return done(e);
//         }
//     }
//     passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser(async (id, done) => {
//         return done(null, await getUserById(id))
//     })
// }

// module.exports = init