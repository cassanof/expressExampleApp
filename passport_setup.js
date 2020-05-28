/* //* How serialize and deserialize work together
passport.serializeUser(function(user, done) {
  done(null, user.id);
});            │
               │ 
               │
               └─────────────────┬──→ saved to session
                                 │    req.session.passport.user = {id: '..'}
                                 │
                                 ↓           
passport.deserializeUser(function(id, done) {
                 ┌───────────────┘
                 │
                 ↓ 
  User.findById(id, function(err, user) {
      done(err, user);
  });            └──────────────→ user object attaches to the request as req.user   
}); */

let localStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');
let models = require('./models');

const validPassword = function(user, password) {
  return bcrypt.compareSync(password, user.password);
};

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    models.User.findOne({
      where: {
        'id': id
      }
    }).then(user => {
      if (user == null) {
        done(new Error('Wrong user id'));
      }
      done(null, user);
    });
  });
  passport.use(new localStrategy({
    usernameField: 'email', //actual html ids, req.body.email
    passwordField: 'password',
    passReqToCallback: true,
  }, 
  function(req, email, password, done) {
    return models.User.findOne({
      where: {
        'email': email
      }
    }).then(user => {
      if(user == null) {
        req.flash('message', 'Incorrect credentials');
        return done(null, false);
      } else if (user.password == null || user.password == undefined) {
        req.flash('message', 'You should reset your password');
        return done(null, false);
      } else if (!validPassword(user, password)) {
        req.flash('message', 'Incorrect credentials');
        return done(null, false);
      }
      return done(null, user);
    }).catch(err => {
      done(err, false);
    });
  }));
};