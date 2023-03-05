import User from "../models/user.model";
import Resume from "../models/resumemodel";
import AuthService from "./auth.service";


export default class resumeService {
    constructor () {
        this.authService = new AuthService();
    }
    async resumeService (body){
        const user = await User.findById(user.id);

        if (user){
            const resume = {
                personal_information: body.personal_information,
                work_experience: body.work_experience,
                education_training: body.education_training,
                personal_skill: body.personal_skill,
                user_id: this.authService.user.id
            };
    
            const createResume = Resume.create(resume);
        }
        
        return createResume;
    }
}