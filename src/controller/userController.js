
import User from "../models/user.model";

//get user profile
export const getSpecificUser = async (req, res) => {
    const foundUser = await User.findById();
    try {
        if (foundUser) {
            res.json({
                status: "success",
                data: { foundUser }
            });
        } else {
            res.json({
                status: "success",
                data: " user with such ID doesnt exist"
            });
        }

    } catch (error) {
        res.json(error.message);

    }
};