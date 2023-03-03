import User from "../models/user.model";
import HttpException from "../utils/exception";
import Resume from "../models/resumemodel";

export default class resumeService {
    async createResume (body){
        const user = await User.findById(User._id);
        const {title, description} = req.body;

    }
}