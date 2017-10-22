import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Question, QuestionOptionChildren } from '../models/question.model';


@Component({
  selector: 'survey-question-carousel',
  templateUrl: './question-carousel.component.html',
  styleUrls: ['./question-carousel.component.scss']
})
export class QuestionCarouselComponent implements OnInit {
  @Input() questions: QuestionOptionChildren[];
  @Output() questionFormSubmitted = new EventEmitter<Question>();
  private _activeIndx = new BehaviorSubject<number>(0);
  modalForm: AvailableForms;
  formTemplate: any;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  addParentQuestion(content) {
    this.modalForm = AvailableForms.questionForm;
    this.formTemplate = { survey_id: this.activeQuestion.survey_id };
    this.openModal(content);
  }



  private openModal(content) {
    this.modalService.open(content);
  }


  updateActiveIndex(indx: number) {
    this._activeIndx.next(indx);
  }


  get activeQuestion() {
    return this.questions[this.activeIndx];
  }


  get activeIndx() {
    return this._activeIndx.getValue();
  }

  saveQuestion(data: Question) {
    this.questionFormSubmitted.emit(data);
  }

}


export enum AvailableForms {
  questionForm,
  optionForm
}


