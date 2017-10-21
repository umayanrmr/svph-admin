import { Type } from '../../models/type.model';
import { Category } from '../../models/category.model';
import { Survey } from '../../models/survey.model';


import { EventEmitter } from '@angular/core';
import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from 'app/core/contracts/i-alert';
import { IFormComponent } from 'app/core/contracts/i-form-component';
import { ICategoryService } from 'app/core/contracts/i-http-services';
import { CategoryService } from 'app/survey/services/category.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISubscription } from 'rxjs/Subscription';

import { SurveyTypeService } from '../../../services/survey-type.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sur-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, IFormComponent  {
  @Input() set survey(val: Survey){
    this._survey.next(val);
  }
  @Input() btnLabel = 'Submit';
  @Input() set isPending(val){
    this._ispending.next(val);
  }
  @Input() alert: IAlert;

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();

  private _survey = new BehaviorSubject<Survey>(new Survey());
  private _ispending = new BehaviorSubject<boolean>(false);

  categories: Category[];
  types: Type[];
  form: FormGroup;

  constructor(private fb: FormBuilder,
              @Inject(CategoryService) private _categorySrvc: ICategoryService,
              private _typeSrvc: SurveyTypeService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this._initializeForm();
    const cat_sub: ISubscription =  this._categorySrvc.list()
    .subscribe(
      data => { this.categories = <Category[]> data['category'] },
      err => {},
      () => {
        cat_sub.unsubscribe()
      });

    const typ_sub: ISubscription = this._typeSrvc.getAll()
    .subscribe(
      data => { this.types = <Type[]> data.type},
      err => {},
      () => typ_sub.unsubscribe()
    );
    this._ispending.subscribe(data => {
      this.toggleControls(data);
    });

    this._survey
    .subscribe(data => {
      if (!data) {
        return;
      }
      this.form.patchValue(data)
    });
  }


  get survey() {
    return this._survey.getValue();
  }

  get isPending(){
    return this._ispending.getValue();
  }

  isDirty(): boolean {
    return true;
  }

  onSubmit(data: any) {
    if (this.form.invalid) {
       return;
    }
    this.formSubmit.emit(data);
  }

  private _initializeForm() {
    this.form = this.fb.group({
      id: ['', Validators.required ],
      survey_type_id: ['', Validators.required ],
      survey_category_id: ['', Validators.required ],
      survey_title: ['', Validators.required ],
      survey_isfeatured: [ 0, Validators.required ],
      survey_isactive: ['', Validators.required],
      survey_isdeleted: ['', Validators.required]
    })
  }

  open(content) {
    this.modalService.open(content);
  }

  toggleControls(data: boolean) {
    if (data) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).disable();
      });
    }else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).enable();
      });
    }
  }
}
