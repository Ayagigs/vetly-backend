import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

export default class GoogleAuthStrategy {

    constructor(type) {
        this.clientID = GOOGLE_CLIENT_ID;
        this.clientSecret = GOOGLE_CLIENT_SECRET;
        this.callbackUrl = GOOGLE_CALLBACK_URL;
        this.type = type;
        this.strategy = null;
        this.init();
    }

    init () {
        this.strategy = new GoogleStrategy({
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackUrl
        }, 
        async ( _accessToken, _refreshToken, profile, done ) => {
            try {
                let user = profile.emails[0].value;
                return done(null, user);
            } catch (error) {
                console.log(error);
                done(error);
            }
        });

        passport.use("google", this.strategy);

    }

    authenticate = (req, res, next) => {
        passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
    };

    callback = (req, res) => {
        passport.authenticate("google", { failureRedirect: "/login", session: false })(req, res, () => {
            const redirectUrl = `https://ikecruz.dev?token=${req.user}`;
            res.redirect(redirectUrl);
        });
    };

}