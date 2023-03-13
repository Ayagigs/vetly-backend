import User from "../models/user.model";
import Resume from "../models/resume.model";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";



export default class ResumeService {

    async initResume (user){

        const alreadyCreated = await Resume.findOne({
            user_id: user.id
        });

        const userFromDb = await User.findOne({
            _id: user.id
        });

        if (alreadyCreated && userFromDb.userType === "applicant") {
            throw new HttpException(
                StatusCodes.CONFLICT,
                "Applicant already has a resume created"
            );
        }

        return await Resume.create({
            user_id: user.id
        });

    }
   
    async updateResume (body){

        const resume = {
            personal_information: body.personal_information,
            work_experience: body.work_experience,
            education_training: body.education_training,
            personal_skill: body.personal_skill,
        };
    
        return await Resume.create(resume);
        
    }

    async findOne (id){

        const resume = await Resume.findOne({
            _id: id
        });

        if (!resume) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "Record not found"
            );
        }

        return resume;

    }

    async listByUser (user) {

        const resumes = await Resume.find({
            user_id: user.id
        });

        return user.userType === "applicant" ? resumes[0] : resumes;

    }

}