
import User from "../models/user.model";


//get all user

export const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status().json({ error: "users not found" });
        }

        return res.status().json({ users });
    } catch (error) {
        error.message;
    }
};

//get one user
export const fetchOneUserById = async (req, res) => {
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