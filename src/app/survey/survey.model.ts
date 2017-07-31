import { IOption, IQuestion, IQuestionOption, ISurvey, ISurveyDuration, ISurveyQuestion } from './shared/survey.interface';



export class Survey implements ISurveyQuestion {
    id: number;
    created_at: string;
    durations: ISurveyDuration[];
    survey_category_id: number;
    survey_isactive: number;
    survey_isdeleted: number;
    survey_isfeatured: number;
    survey_title: string;
    survey_type_id: number;
    updated_at: string;
    respondents: number;
    img: string;
    questions: IQuestionOption[];

    constructor(obj?: any) {
        this.id                 = obj && obj.id || 0;
        this.created_at         = obj && obj.created_at || '';
        this.durations          = obj && obj.durations || [];
        this.survey_category_id = obj && obj.survey_category_id || 0;
        this.survey_isactive    = obj && obj.survey_isactive || 0;
        this.survey_isdeleted   = obj && obj.survey_isdeleted || 0;
        this.survey_isfeatured  = obj && obj.survey_isfeatured || 0;
        this.survey_title       = obj && obj.survey_title || '';
        this.survey_type_id     = obj && obj.survey_type_id || 0;
        this.updated_at         = obj && obj.updated_at || '';
        this.respondents        = obj && obj.respondents || 0;
        this.img                = obj && obj.img || '';
        this.questions          = obj && obj.questions || [];
    }


    setQuestions(val: IQuestionOption[]) {
        this.questions = val;
    }

    addQuestion(val:IQuestionOption) {
        this.questions.push(val);
    }


    addQuestionOption(indx: number, val: IOption) {
        this.questions[indx].options.push(val);
    }
}
