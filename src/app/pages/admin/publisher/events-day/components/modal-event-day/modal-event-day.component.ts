import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { EventDayService } from '@pages/admin/publisher/shared/services/event-day.service';
import { TemplateCardsService } from '@pages/admin/publisher/shared/services/template-cards.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { BaseFormEventDay } from '@pages/admin/publisher/shared/utils/base-form-event-day';
import { TemplateCard } from '@adminShared//models/template-card.model';
import { Condition, EventDay, Parameter } from '@adminShared//models/event-day.model';
import { DomSanitizerService } from '@app/shared/services/dom-sanitizer.service';
import { ACTIONS, DATE_FORMAT } from '@adminShared/models/shared.model';
import { AbstractControl } from '@angular/forms';
import { LoaderService } from '@appShared/services/loader.service';

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

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT}
  ]
})
export class ModalEventDayComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);
  actionTODO: ACTIONS;

  cards: TemplateCard[] = [];
  sidenavOpened = false;
  selectCard: TemplateCard = null;
  conditionsRes: Condition[];
  parametersRes: Parameter[];
  today = new Date();
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsService: TemplateCardsService,
    private domSanitizerSvc: DomSanitizerService,
    public eventDayForm: BaseFormEventDay,
    private eventDaySvc: EventDayService,
    private loaderSvc: LoaderService
  ) {
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.eventDayForm.controls;
  }

  //TODO: Revisar
  get loading() {
    return this.loaderSvc.isLoading.value;
  }

  setDateFormat(event: MatDatepickerInputEvent<unknown>) {
    this.eventDayForm.setDate(event);
  }


  loadCards(onChange?: boolean) {
    this.eventDayForm.baseForm.controls.plantilla.markAsTouched();
    this.eventDayForm.baseForm.controls.plantilla.markAsDirty();
    if (!this.selectCard) {
      this.eventDayForm.baseForm.controls.plantilla.setErrors({ incorrect: true });
    }

    if (onChange) {
      if (confirm('Seguro que desea ver las plantillas?')) {
        this.sidenavOpened = true;
        this.templateCardsService.getAllCards()
          .pipe(takeUntil(this.destroy$))
          .subscribe(cards => this.cards = cards, () => {
            SwAlert.showValidationMessage(
              'Error cargando las plantillas');
          });
      }
    } else {
      this.sidenavOpened = true;
      this.templateCardsService.getAllCards()
        .pipe(takeUntil(this.destroy$))
        .subscribe(cards => this.cards = cards, () => {
          SwAlert.showValidationMessage(
            'Error cargando las plantillas');
        });
    }
  }

  onSelectCard(card: TemplateCard) {
    if (confirm('Seguro que desea seleccionar ésta plantilla?')) {
      this.selectCard = card;
      this.eventDayForm.baseForm.controls.plantilla.setValue(card);
      this.sidenavOpened = false;
    }
  }

  sanitizeHTML(cardText: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(cardText);
  }

  onRefresh(refreshEvent?: boolean) {
    if (refreshEvent || refreshEvent !== false) {
      this.loadCards();
    }
  }

  onSave() {
    this.eventDaySvc.save(this.eventDayForm.baseForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event) {
          SwAlert.fire(
            `${this.actionTODO === 'AGREGAR' ? 'GUARDADO' : 'ACTUALIZADO'}`,
            `<b>El evento se pudo ${this.actionTODO.toLowerCase()} exitosamente</b>`,
            'success').then();
          this.onClose(true);
        }
      }, (err) => {
        SwAlert.showValidationMessage(
          `Error al ${this.actionTODO.toLowerCase()} el evento. ${err.status}`);
      });
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.eventDayForm.baseForm.reset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    if (this.data?.event) {
      this.actionTODO = 'EDITAR';
      this.pathFormData(this.data?.event);
    } else {
      this.eventDayForm.baseForm.get('id').setValidators(null);
      this.eventDayForm.baseForm.get('id').updateValueAndValidity();
      this.actionTODO = 'AGREGAR';
    }

    this.eventDaySvc.getConditions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conditions => {
        if (conditions) {
          this.conditionsRes = conditions;
        }
      }, (_) => {
        SwAlert.showValidationMessage(
          `No se pudo cargar las condiciones.`);
      });
  }

  ngAfterViewInit() {
    this.eventDayForm.baseForm.controls.plantilla.markAsPristine({ onlySelf: true });
  }


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private pathFormData(event: EventDay): void {
    this.eventDayForm.baseForm.patchValue(event);
    this.selectCard = event.plantilla;
  }

}
