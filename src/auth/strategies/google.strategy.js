import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../../models/user.model";
import AuthService from "../auth.service";

export default class GoogleAuthStrategy {

    constructor() {
        this.clientID = GOOGLE_CLIENT_ID;
        this.clientSecret = GOOGLE_CLIENT_SECRET;
        this.callbackUrl = GOOGLE_CALLBACK_URL;
        this.strategy = null;
        this.authService = new AuthService();
        this.init();
    }

    init () {
        this.strategy = new GoogleStrategy({
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackUrl,
            passReqToCallback: true
        }, 
        async (req, _accessToken, _refreshToken, profile, done ) => {
            try {
                const googleuser = {
                    fullname: profile.displayName,
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                    userType: req.query.state
                };

                let user = await User.findOne({$or: [{"google.email": googleuser.google.email}, {"github.email": googleuser.google.email}, {"linkedin.email": googleuser.google.email}]});

                if (!user){
                    user = await User.create(googleuser);
                } else {
                    user = await User.findOneAndUpdate({_id: user.id}, googleuser, {new: true});
                }
                
                return done(null, user);
            } catch (error) {
                done(error);
            }
        });

        passport.use("google", this.strategy);

    }

    authenticate = (req, res, next) => {
        passport.authenticate(
            "google", 
            { 
                scope: ["profile", "email"], 
                session: false,
                state: req.query.user_type
            }
        )(req, res, next);
    };

    callback = (req, res) => {
        passport.authenticate("google", { failureRedirect: "/login", session: false })(req, res, () => {
            const token = this.authService.signJwt(req.user.id);
            const redirectUrl = `https://ikecruz.dev?token=${token}`;
            res.redirect(redirectUrl);
        });
    };

}