import { FRONTEND_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../../config";
import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import User from "../../models/user.model";
import AuthService from "../auth.service";

export default class GithubAuthStrategy {

    constructor() {
        this.strategy = null;
        this.authService = new AuthService();
        this.init();
    }

    init () {
        this.strategy = new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
            passReqToCallback: true,
            scope: [ "user:email" ]
        }, 
        async (req, _accessToken, _refreshToken, profile, done ) => {
            try {
                const githubuser = {
                    fullname: profile.displayName,
                    github: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                    userType: req.query.state
                };

                let user = await User.findOne({$or: [{"local.email": githubuser.github.email} ,{"google.email": githubuser.github.email}, {"github.email": githubuser.github.email}, {"linkedin.email": githubuser.github.email}]});

                if (!user){
                    user = await User.create(githubuser);
                } else {
                    user = await User.findOneAndUpdate({_id: user.id}, githubuser, {new: true});
                }
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        });

        passport.use("github", this.strategy);

    }

    authenticate = (req, res, next) => {
        passport.authenticate(
            "github", 
            {
                session: false,
                state: req.query.user_type
            }
        )(req, res, next);
    };

    callback = (req, res) => {
        passport.authenticate("github", { failureRedirect: `${FRONTEND_URL}/login`, session: false })(req, res, () => {
            const token = this.authService.signJwt(req.user.id);
            const redirectUrl = `${FRONTEND_URL}?token=${token}`;
            res.redirect(redirectUrl);
        });
    };

}