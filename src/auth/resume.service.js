import User from "../models/user.model";
import Resume from "../models/resumemodel";



export default class ResumeService {
   
    async createResume (body){
        const user = await User.findById();

        const resume = {
            personal_information: body.personal_information,
            work_experience: body.work_experience,
            education_training: body.education_training,
            personal_skill: body.personal_skill,
            user_id: user.id
        };
    
        const createResume = await Resume.create(resume);
        
        
        return createResume;
    }
}