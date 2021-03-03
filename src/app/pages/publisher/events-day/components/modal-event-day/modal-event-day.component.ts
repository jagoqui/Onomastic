import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SafeHtml} from '@angular/platform-browser';
import {EventDayService} from '@app/pages/publisher/services/event-day.services';
import {TemplateCardsService} from '@app/pages/publisher/services/template-cards.service';
import {ConditionRes, Parameter} from '@app/shared/models/event-day.model';
import {Plantilla} from '@app/shared/models/template-card.model';
import {BaseFormEventDay} from '@app/shared/utils/base-form-event-day';
import {DomSanitizerService} from '@shared/services/dom-sanitizer.service';
import * as moment from 'moment';
import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from 'rxjs/operators';


// eslint-disable-next-line no-shadow
enum Action {
  edit = 'Editar',
  new = 'Crear',
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-modal',
  templateUrl: './modal-event-day.component.html',
  styleUrls: ['./modal-event-day.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ModalEventDayComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);
  actionTODO = '';

  cards: Plantilla[] = [];
  sidenavOpened = false;
  selectCardHTML: SafeHtml = null;
  conditionsRes: ConditionRes[];
  selectedIdFilterAssociation;
  parametersRes: Parameter[];
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsService: TemplateCardsService,
    private domSanitizerSvc: DomSanitizerService,
    public eventDayForm: BaseFormEventDay,
    private eventDaySvc: EventDayService,
  ) {
  }

  setDateFormat(event: MatDatepickerInputEvent<unknown>) {
    this.eventDayForm.baseForm.controls.fecha.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  setIdAssociation(id: any, indexClear: number) {
    this.selectedIdFilterAssociation[indexClear] = id;
    this.eventDayForm.clearParameter(indexClear);
  }

  removeCondition(i: number) {
    this.eventDayForm.removeCondition(i);
    this.selectedIdFilterAssociation.splice(i, 1);
    this.selectedIdFilterAssociation.push(null);
  }

  setParameters(condition: ConditionRes): string {
    this.parametersRes = condition.parametros;
    return condition.condicion;
  }

  onClearParameter(i: number) {
    this.eventDayForm.clearParameter(i);
    this.selectedIdFilterAssociation[i] = -1;
  }

  loadCards(onChange?: boolean) {
    this.eventDayForm.baseForm.controls.plantilla.markAsTouched();
    this.eventDayForm.baseForm.controls.plantilla.markAsDirty();
    if(!this.selectCardHTML){
      this.eventDayForm.baseForm.controls.plantilla.setErrors({incorrect: true});
    }

    if (onChange) {
      if (confirm('Seguro que desea ver las plantillas?')) {
        this.sidenavOpened = true;
        this.templateCardsService.getAllCards().subscribe(cards => this.cards = cards);
      }
    } else {
      this.sidenavOpened = true;
      this.templateCardsService.getAllCards().subscribe(cards => this.cards = cards);
    }
  }

  onSelectCard(card: Plantilla) {
    if (confirm('Seguro que desea seleccionar ésta plantilla?')) {
      this.selectCardHTML = this.sanitizeHTML(card.texto);
      this.eventDayForm.baseForm.controls.plantilla.setValue(card);
      this.sidenavOpened = false;
    }
  }

  sanitizeHTML(cardText: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(cardText);
  }

  onRefresh() {
    this.loadCards();
  }

  onSave() {
    console.log(this.eventDayForm);
  }

  onClose(close?: boolean): void {
    console.log(this.eventDayForm.baseForm.value);

    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.eventDayForm.onReset();
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    if (this.data?.event) {
      this.actionTODO = Action.edit;
      this.pathFormData();
    } else {
      this.actionTODO = Action.new;
    }

    this.eventDaySvc.getConditions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conditions => {
        if (conditions) {
          this.conditionsRes = conditions;
          this.selectedIdFilterAssociation = new Array(this.conditionsRes.length + 1);
        }
      }, (err) => {
        console.log('Get condition error! :> ', err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private pathFormData(): void {
    const conditions = this.data?.event.condicionesEvento;
    // if (conditions) {
    //   for (let i = 0; i < conditions.length - 1; i++) {
    //     this.eventDayForm.addParameterFormGroup('condicion');
    //   }
    // }
    this.eventDayForm.baseForm.patchValue(this.data?.event);
  }
}
