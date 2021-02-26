import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { AuthService } from '@app/auth/services/auth.service';
import {
  EventDayService,
} from '@app/pages/publisher/services/event-day.services';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { CondicionesEvento } from '@app/shared/models/event-day.model';
import {
  ByNameId,
  ProgramaAcademicoPorUsuarioCorreo,
} from '@app/shared/models/mail-users.model';
import { PlatformUserResponse } from '@app/shared/models/platform-users.model';
import { Plantilla } from '@app/shared/models/template-card.model';
import { BaseFormEventDay } from '@app/shared/utils/base-form-event-day';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

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

enum Action {
  EDIT = 'Editar',
  NEW = 'Crear',
}

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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModalEventDayComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);
  actionTODO = '';
  maxListsConfig = {
    associations: 5,
    conditions: 5,
  };
  maxConditionsNumber = 5;

  platformUserData: PlatformUserResponse;
  onAddConditions = false;
  cards: Plantilla[] = [];
  sidenavOpened = false;
  selectCardHTML: SafeHtml = null;

  private destroy$ = new Subject<any>();

  // Para cargar campos dinamicamente en el HTML
  associations: ByNameId[];
  conditions: CondicionesEvento[];
  programs: ProgramaAcademicoPorUsuarioCorreo[];
  bondingTypes: ByNameId[];

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService,
    private domSanitazerSvc: DomSanitizerService,
    public eventDayForm: BaseFormEventDay,
    private eventDaySvc: EventDayService,
    private authSvc: AuthService
  ) { }

  private pathFormData(): void {
    const associations = this.data?.event.asociacion;
    const conditions = this.data?.event.condicionesEvento;

    // if (associations) {
    //   for (let i = 0; i < associations.length - 1; i++) {
    //     this.eventDayForm.addParameterFormGroup('asociacion');
    //   }
    // }
    // if (conditions) {
    //   for (let i = 0; i < conditions.length - 1; i++) {
    //     this.eventDayForm.addParameterFormGroup('condicion');
    //   }
    // }
    this.eventDayForm.baseForm.patchValue(this.data?.event);
  }

  setDateFormat(event: MatDatepickerInputEvent<Date>) {
    this.eventDayForm.baseForm.controls.fecha.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  setformGroupField(formGroup: FormGroup, value: any, indexClear: number) {
    // formGroup.controls.condicion.setValue(value.condicion);
    formGroup.controls.id.setValue(value.id);
    this.eventDayForm.conditionsOptionsField.at(indexClear).get('parametro').setValue('');
  }

  checkField(field: string, group?: string, iterator?: number): boolean {
    return this.eventDayForm.isValidField(field, group, iterator);
  }

  loadCards(onChange?: boolean) {
    if (onChange) {
      if (confirm('Seguro que desea ver las plantillas?')) {
        this.sidenavOpened = true;
        this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
      }
    } else {
      this.sidenavOpened = true;
      this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
    }
  }

  onSelectCard(card: Plantilla) {
    if (confirm('Seguro que desea seleccionar ésta plantilla?')) {
      this.selectCardHTML = this.sanatizeHTML(card.texto);
      this.eventDayForm.baseForm.controls.plantilla.setValue(card);
      this.sidenavOpened = false;
    }
  }

  sanatizeHTML(cardText: string): SafeHtml {
    return this.domSanitazerSvc.sanatizeHTML(cardText);
  }

  onClose(close?: boolean): void {
    console.log(this.eventDayForm.baseForm.value);

    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.eventDayForm.onReset();
      this.dialogRef.close();

      // const associations = this.eventDayForm.baseForm.controls.asociacion.value;
      // const conditions = this.eventDayForm.baseForm.controls.condicionesEvento.value;

      // for (const association of associations) {
      //   this.removeOrClearParameter(association, 'asociacion', true);
      // }
      // for (const condition of conditions) {
      //   this.removeOrClearParameter(condition, 'condicionesEvento', true);
      // }
    }
  }

  onSave() {
    console.log(this.eventDayForm);
  }

  ngOnInit(): void {
    if (this.data?.event) {
      this.actionTODO = Action.EDIT;
      this.pathFormData();
    } else {
      this.actionTODO = Action.NEW;
    }

    // this.authSvc.userResponse$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((userRes: PlatformUserResponse) => {
    //     if (userRes) {
    //       this.platformUserData = userRes;
    //     }
    //   });

    this.eventDaySvc.getConditions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conditions => {
        if (conditions) {
          this.conditions = conditions;
        }
      }, (err) => {
        console.log('Get condition error! :> ', err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
