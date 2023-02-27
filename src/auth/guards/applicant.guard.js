import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { JWT_SECRET_KEY } from "../../config";
import User from "../../models/user.model";

export default class ApplicantGuard {

    constructor () {
        this.strategy = null;
        this.init();
    }

    init () {
        this.strategy = new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_KEY,
        },
        async (jwtPayload, done) => {
            const user = await User.findOne({_id: jwtPayload.id, userType: "applicant"});

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        });

        passport.use("applicant", this.strategy);
    }

    guard = (req, res, next) => {
        passport.authenticate("applicant", { session: false })(req, res, next);
    };

}