/**
 * Configure all Passport login here so we don't have to keep it in app.js
 */

/**
 * Import modules
 */
var config          = require('config');
var User            = require('../models').User;
var passport        = require('passport');
// var GoogleStrategy  = require('passport-google-oauth2').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
// var requestPromise  = require('request-promise');

/**
 * These can be (may be in the future) more complex
 * if need be. Depends on how you are handling authentication
 * and serialization
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Setting username field to email rather than username
var localOptions = {
  usernameField: 'email'
};

// Setting up local login strategy
var localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

    user.verifyPassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      return done(null, user);
    });
  });
});

// Setting JWT strategy options
var jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: 'my_precious'//config.secret

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findOne({where: {id: payload.id}}, (err, done) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

// passport.use(
//   new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
//   },
//   function(request, username, password, done) {
//     process.nextTick(function() {
//       return User.findOne({where: {username: username, provider: 'local'}})
//       .then(function(user) {
//         console.log(user);
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       }).catch(function(error) {
//         return done(error);
//       });

//     });

//   })

// );


// function findOrCreateUser(provider, social_id, profile, attributes) {
//   return User.findOne({where: {provider: provider, social_id: social_id}}).then(function(user) {
//     if (user) {
//       /**
//        * User exists, build updated attributes object and
//        * update the user in the database
//        */

//       attributes = buildUpdatedAttributes(provider, social_id, profile, user, attributes);
//       return user.update(attributes).then(function(updatedUser) {
//         return updatedUser;
//       }).catch(function(error) {
//         throw error;
//       });

//     } else {
//       /**
//        * User does not exist, build complete attributes
//        * object and create user in the database
//        */
//       attributes = buildCompleteAttributes(provider, social_id, profile, user, attributes);
//       return User.create(attributes).then(function(newUser) {
//         return newUser;
//       }).catch(function(error) {
//         throw error;
//       });
//     }
//     // User exists
//   }).catch(function(error) {
//     throw error;
//   });
// }

// function buildUpdatedAttributes(provider, social_id, profile, user, attributes) {
//   var updatedUserAttributes = {};
//   if(provider == 'google') {
//     updatedUserAttributes = {
//       profile_picture: profile.photos[0].value.split("?")[0],
//       last_active: Math.trunc(Date.now()/1000),
//       access_token: attributes.access_token,
//       access_token_exp: user.access_token_exp,
//       refresh_token: attributes.refresh_token || user.refreshToken
//     };
//   } else if(provider == 'twitter') {
//     updatedUserAttributes = {
//       profile_picture: profile.photos[0].value,
//       last_active: Math.trunc(Date.now()/1000),
//       access_token: attributes.access_token,
//       access_token_secret: attributes.access_token_secret
//     };
//   }

//   return updatedUserAttributes;
// }

// function buildCompleteAttributes(provider, social_id, profile, user, attributes) {
//   var completeUserAttributes;
//   if(provider == 'google') {
//     completeUserAttributes = {
//       social_id: social_id,
//       name: profile.displayName,
//       username: profile.email.split("@")[0],
//       email: profile.email,
//       profile_picture: profile.photos[0].value.split("?")[0],
//       provider: provider,
//       last_active: Math.trunc(Date.now()/1000),
//       access_token: attributes.access_token,
//       refresh_token: attributes.refresh_token
//     };
//   } else if(provider == 'twitter') {
//     completeUserAttributes = {
//       social_id: social_id,
//       name: profile.displayName,
//       username: profile.username,
//       email: null,
//       profile_picture: profile.photos[0].value,
//       provider: provider,
//       last_active: Math.trunc(Date.now()/1000),
//       access_token: attributes.access_token,
//       access_token_secret: attributes.access_token_secret
//     };
//   }

//   return completeUserAttributes;
// }
