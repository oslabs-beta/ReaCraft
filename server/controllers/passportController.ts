import passport, { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import { DefaultError } from '../../docs/types';
import { userQueryRes } from './userController';
import { setCookie } from './cookieController';
import db from '../models/dbModel';

// interface User {
//     id: string;
//     username?: string;
//     email?: string;
//     profile_image?: string;
//     created_at?: string;
//     last_login?: string;
// };

// type userRow = {
//     _id: number;
//     username: string;
//     email: string;
//     profile_image: string;
//     created_at: string;
//     last_login: string;
// }

// function convertToUser(user: userRow): User {
//     return {
//         id: user._id.toString(),
//         username: user.username,
//         email: user.email,
//         profile_image: user.profile_image,
//         created_at: user.created_at,
//         last_login: user.last_login,
//     }
// }

// initialize google oauth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function
    ) => {
      const email = profile.emails ? profile.emails[0].value : null; // get the user's email from google profile
      console.log('this is the email from google strategy', email);
      if (!email) {
        return done(new Error('No email found'), null);
      }
      try {
        const userData: userQueryRes = await db.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );
        let user = userData.rows[0];
        console.log('this is user from the query in the try block', user);

        if (!user) {
          console.log('user not found, creating new user');
          // user not found, create a new user
          const newUser: userQueryRes = await db.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;',
            // handle case where displayName might not exist
            [profile.displayName || 'New User', email]
          );
          user = newUser.rows[0];
        }
        // user is found or newly created, proceed to log them in
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// serialize user into the session
// serialization is the process of converting a user object into a format that can be stored in a session, it determines which data of the user object should be stored in the session
// what happens doing serialization - 1. user logs in, passport will serialize the user instance with the information provided by the authentication strategy's verify callback
// 2. passport will then save this serialized information, to the session
// 3. session data is then sent to the client as a cookie
// tldr, only the user ID is serialized to the session, so the session will be small and lightweight
passport.serializeUser((user: any, done) => {
  console.log('serializing user id', user._id.toString());
  done(null, user._id.toString());
});

// deserialize user from the session
// opposite process of serialization. converts the serialized user information back into a user object
// 1. on each request, passport will read the user ID from the session data in the session cookie that comes with the request
// 2. passport will then use this ID to retrieve the full user object, typically from the database
// 3. once the user object is retrieved, it's made available on 'req.user' in route handlers and middleware
// tldr, when a quest is made, this function receives the ID from the session and uses it to retrieve the full user object from the database
passport.deserializeUser(async (id: any, done) => {
  try {
    const numericId = parseInt(id, 10);
    console.log('this is the numericId', numericId);
    const result = await db.query('SELECT * FROM users WHERE _id = $1', [
      numericId,
    ]);
    console.log('this is the result from deserializeUser', result);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
      console.log('this is result.rows', result.rows[0]);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

// middleware to initiate a local login
export const authenticateGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

// middleware for google oauth callback
export const authenticateGoogleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('google', (err: DefaultError, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    // logIn is a passport function to establish a login session, passport will serialize the user instance with the information provided by the autentication strategy's verify callback
    // req.logIn takes the users information and passes it to serializeUser
    // req.logIn triggers login process and with session and cookie middleware, it maintains user state across requests
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // user is logged in, set the cookie
      res.locals.userId = user._id;
      console.log('this is user id from req.logIn', user._id);
      setCookie(req, res, () => {
        // after setting the cookie, redirect to the home page
        res.redirect('/home');
      });
    });
  })(req, res, next);
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  // destroy session
  if (req.session) {
    console.log('session found', req.session);
    req.logout((err: DefaultError) => {
      if (err) {
        console.error('logout error', err);
        return next(err);
      }
      console.log('logout successful');

      // destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error('session destroy error:', err);
          return next(err);
        }
        console.log('session destroyed');

        // clear all cookies
        res.clearCookie('connect.sid', { path: '/' });
        res.clearCookie('user_id');
        res.clearCookie('sessionID');
        return next();
      });
    });
  } else {
    console.log('no session found');
    res.clearCookie('user_id');
    res.clearCookie('sessionID');
    return next();
  }
};
