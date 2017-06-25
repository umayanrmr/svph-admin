import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { ISurveyService, IQuestionService, IOptionService } from 'app/core/contracts/i-http-services';
import { SurveyService } from './../survey.service';
import { QuestionService } from './../question/question.service';
import { OptionService } from './../question/option/option.service';
import { ISurveyForList,IQuestionDTO,ISurveyDTO,IOptionDTO } from './../i-survey';
import { IAlert } from 'app/core/contracts/i-alert';
import { Survey } from './../survey.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
@Component({
  selector: 'sur-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  survey: Survey;
  isPending: boolean;


  isOptionPending = []; //id and value only ex 1: false
  isQuestionPending = [];
  

  isAddQuestionPending: boolean;
  isAddOptionPending = [];
  isUpdateOptionPending = [];
  isUpdateQuestionPending = [];
  alert: IAlert;
  modalReference: any;
  
  constructor(@Inject(SurveyService) private _surveySrvc: ISurveyService,
              @Inject(QuestionService) private _questionSrvc: IQuestionService,
              @Inject(OptionService) private _optionSrvc: IOptionService,
              private _route: ActivatedRoute,

              private modalService: NgbModal) { }
  ngOnInit() {
    let id_param_subscription = 
      this._route.params.switchMap((params: Params) => 
      Observable.forkJoin([
        this._surveySrvc.getById(params['id']),
        this._questionSrvc.list(params['id'])
      ])).map((data: any) => {
        let survey : ISurveyDTO = data[0].survey;
        let questions: IQuestionDTO[] = [];

        var items = data[1].questionnaire;
        items.filter(parent => parent.question_parent == 0).map(
          question => {
            question.survey_id = survey.id;
            question.options.map(opt => {
              opt.question_id = question.question_id;
            })
            question.childrens = [];
            questions.push(question)
          }
        )

        items.filter(children => children.question_parent > 0).map(
          children => {
            var parent_indx = questions.findIndex(questions => questions.question_id == children.question_parent);
            children.survey_id = survey.id;
            children.options.map(opt => {
              opt.question_id = children.question_id;
            })
            questions[parent_indx].childrens.push(children);
          }
        )
        survey.questions = questions;
        return survey;
      })
      .subscribe(
        data => {
          this.survey = new Survey(data);
          console.log(this.survey);
        },
        err => {},
        () => {
          id_param_subscription.unsubscribe();
        }
      );


  }

  open(content) {
    this.modalReference = this.modalService.open(content,{
      size: 'lg'
    });
  }


  updateQuestion(event : IQuestionDTO){
    this.isQuestionPending[event.question_id] = true;
    let update_que_sub : ISubscription = 
      this._questionSrvc.update(event).subscribe(
        data => {},
        err => {
          this.isQuestionPending[event.question_id] = false;
          console.log(err);
        },
        () => {
          this.isQuestionPending[event.question_id] = false;
          update_que_sub.unsubscribe();
        }
      )
  }

  updateOption(index: any, event: IOptionDTO){
    this.isOptionPending[event.option_id] = true;
    let update_opt: ISubscription =  this._optionSrvc.update(event).subscribe(
      data => {},
      err=> {
        this.isOptionPending[event.option_id] = false;
      },
      () => {
        update_opt.unsubscribe();
        this.isOptionPending[event.option_id] = false;
      })
    // console.log('Option Update Event: ',question_indx,option_indx,event)
  }

  addOption(indexes: any[],question_id,event: IOptionDTO){
    this.isOptionPending[question_id] = true;
    event.question_id = question_id;
    let add_opt: ISubscription = 
      this._optionSrvc.add(event).subscribe(
        data => {
          if(indexes.length > 1){
            this.survey.questions[indexes[0]].childrens[indexes[1]].options.push(data.option);  
          }
          this.survey.questions[indexes[0]].options.push(data.option);
        },
        err=> {
          this.isOptionPending[question_id] = false;
        },
        () => {
          this.isOptionPending[question_id] = false;
          add_opt.unsubscribe();
        }
      )
  }

  addQuestion(event){
    this.isAddQuestionPending = true;
    event['survey_id'] = this.survey.id;
    let add_que: ISubscription = this._questionSrvc.add(event).subscribe(
      data => {
        this.survey.questions.push(data.question);
      },
      err => {
        this.isAddQuestionPending = false;
      },
      () => {
        this.modalReference.close();
        this.isAddQuestionPending = false;
        add_que.unsubscribe();
      }

    );
  }

  updateSurvey(event){
    this.isPending = true;
    let upd_sur: ISubscription = this._surveySrvc.update(event).subscribe(
      data => {},
      err => {
        this.isPending = false;
        console.log(err)
      },
      () => {
        this.isPending = false;
        upd_sur.unsubscribe();
      }
      );
    // console.log('Survey Update Event: ', event);
  }
  // setSurvey(id: number){
  //   let sur_sub: ISubscription = 
  //     this._surveySrvc.getById(id)
  //     .subscribe(
  //       data => this.survey = new Survey(data),
  //       err => {},
  //       () => {
  //         sur_sub.unsubscribe();
  //       })
  // }

}
