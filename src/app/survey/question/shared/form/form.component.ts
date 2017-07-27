import { IOptionDTO, IQuestionDTO } from '../../../shared/survey.interface';
import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFormComponent } from 'app/core/contracts/i-form-component';
import { IOptionService } from 'app/core/contracts/i-http-services';
import { OptionService } from 'app/survey/question/option/option.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISubscription } from 'rxjs/Subscription';

import { Question } from './../../question.model';


@Component({
  selector: 'sur-que-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, IFormComponent {
  @Input() btnLabel : string = "Add";
  @Input() 
  set question(val: IQuestionDTO){
    this._question.next(new Question(val));
  }
  get question(){
    return this._question.getValue();
  }
  
  @Output() formSubmit : EventEmitter<any> = new EventEmitter<any>(); //OUTPUT
  @Output() newSubQuestion : EventEmitter<any> = new EventEmitter<any>(); //OUTPUT
  @Input() set isPending(val){
    this._ispending.next(val);
  }

  get isPending(){
    return this._ispending.getValue();
  }
  form: FormGroup;
  private _ispending : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _question : BehaviorSubject<Question> = new BehaviorSubject<Question>(new Question());
  question_with_parent_id: IQuestionDTO;
  
  modalReference: any;
  public isoptionpending = [];
  constructor(private fb: FormBuilder,
             @Inject(OptionService) private _optionSrvc: IOptionService,
              private modalService: NgbModal) { }
  
  ngOnInit() {
    this.form = this.fb.group({
      question_id: [0,Validators.required],
      question_parent: [0,Validators.required],
      survey_id: [0,Validators.required],
      question_caption: ['',Validators.required],
      option_type: ['',Validators.required],
      question_isdeleted: ['', Validators.required]
    })



    this._question.subscribe((data : IQuestionDTO ) => {
      if(!data) return;
      this.form.patchValue(data);
    })

    this._ispending.subscribe(data => {
      this.toggleControls(data)
    });
  }

  isDirty(): boolean{
    return true;
  }

  toggleControls(data: boolean){
    if(data){
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).disable();
      });
    }else{
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).enable();
      });
    }
  }

  onSubmit(form: any){
    if(this.form.invalid) return;
    this.formSubmit.emit(form);
  }

  open(content) {
    this.modalReference = this.modalService.open(content,{
      size: 'lg'
    });
  }


  addOption(event: IOptionDTO){
    this.isoptionpending[0] = true;
    event.question_id = this.question.question_id;
    let add_opt: ISubscription = 
      this._optionSrvc.add(event).subscribe(
        data => { this.question.options.push(data['option']); },
        err=> {
          this.isoptionpending[0] = false;
         },
        () => { 
          this.isoptionpending[0] = false;
          add_opt.unsubscribe(); 
        }
      )
  }

  updateOption(event: IOptionDTO){
    this.isoptionpending[event.option_id] = true;
    let update_opt: ISubscription =  this._optionSrvc.update(event).subscribe(
      data => {},
      err=> { 
        this.isoptionpending[event.option_id] = false;
      },
      () => { 
        this.isoptionpending[event.option_id] = false;
        update_opt.unsubscribe();
      }
    )
  }


  addSubQuestion(event: IQuestionDTO){
    event.question_parent = this.question.question_id;
    event.survey_id = this.question.survey_id;
    this.newSubQuestion.emit(event);
  }
}
