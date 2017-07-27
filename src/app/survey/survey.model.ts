import { IOption, IQuestion, IQuestionOption, ISurvey, ISurveyDuration, ISurveyQuestion } from './shared/survey.interface';



export class Survey implements ISurveyQuestion{
    id: number;
    survey_type_id: number;
    survey_category_id: number;
    survey_title: string;
    survey_isactive: number;
    survey_isfeatured: number;
    survey_isdeleted: number;
    created_at: string;
    updated_at: string;
    start_date: string;
    end_date: string;
    respondents: number;
    img: any;
    durations: ISurveyDuration[];
    questions: IQuestionOption[];

    constructor(obj?: any){
        this.id                 = obj && obj.id || 0;
        this.survey_type_id     = obj && obj.survey_type_id || 0;
        this.survey_category_id = obj && obj.survey_category_id || 0;
        this.survey_title       = obj && obj.survey_title || '';
        this.survey_isactive    = obj && obj.survey_isactive || 0;
        this.survey_isfeatured  = obj && obj.survey_isfeatured || 0;
        this.survey_isdeleted   = obj && obj.survey_isdeleted || 0;
        this.created_at         = obj && obj.created_at || '';
        this.updated_at         = obj && obj.updated_at || '';
        this.start_date         = obj && obj.start_date || '';
        this.end_date           = obj && obj.end_date || '';
        this.questions          = obj && obj.questions || [];
        
    }


    setQuestions(val: IQuestionOption[]){
        this.questions = val;
    }

    addQuestion(val:IQuestionOption){
        this.questions.push(val);
    }


    addQuestionOption(indx: number, val : IOption){
        this.questions[indx].options.push(val);
    }
}