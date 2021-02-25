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
  EmailUsersService,
} from '@app/pages/publisher/services/email-users.service';
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
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

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
  private subscripcion: Subscription = new Subscription();
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
    private userSvc: EmailUsersService,
    private eventDaySvc: EventDayService,
    private authSvc: AuthService
  ) { }

  private pathFormData(): void {
    const associations = this.data?.event.asociacion;
    const conditions = this.data?.event.condicionesEvento;

    if (associations) {
      for (let i = 0; i < associations.length - 1; i++) {
        this.eventDayForm.addParameterFormGroup('asociacion');
      }
    }
    if (conditions) {
      for (let i = 0; i < conditions.length - 1; i++) {
        this.eventDayForm.addParameterFormGroup('condicion');
      }
    }
    this.eventDayForm.baseForm.patchValue(this.data?.event);
  }

  setDateFormat(event: MatDatepickerInputEvent<Date>) {
    this.eventDayForm.baseForm.controls.fecha.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  checkField(field: string, group?: string, iterator?: number): boolean {
    return this.eventDayForm.isValidField(field, group, iterator);
  }

  setformGroupID(formGroup: FormGroup, id: number) {
    formGroup.controls.id.setValue(id);
  }

  setformGroupCondition(formGroup: FormGroup, id: number, parametro: string) {
    formGroup.controls.id.setValue(id);
    formGroup.controls.parametro.setValue(parametro);

    this.onAddConditions = formGroup.controls.parametro.value === 'cumpleaños' ? false : true;
  }

  setformGroupParameter(formGroup: FormGroup, parameter: string) {
    formGroup.controls.parametro.setValue(parameter);
  }

  addParameterFormGroup(formGroup: string): void {
    this.eventDayForm.addParameterFormGroup(formGroup);
  }

  removeOrClearParameter(iterator: number, formGroup: string, onClose?: boolean): void {
    if (!onClose) {
      if (confirm('Seguro que desea remover éste item de la lista?')) {
        this.eventDayForm.removeOrClearParameter(iterator, formGroup);
      }
    } else {
      this.eventDayForm.removeOrClearParameter(iterator, formGroup);
    }
  }

  onShowAddAssociation(size: number): boolean {
    return (size === (this.getAssociationsSize() - 1) && (this.getAssociationsSize() < this.maxListsConfig.associations));
  }

  getAssociationsSize(): number {
    return this.eventDayForm.baseForm.controls.asociacion.value.length;
  }

  onShowAddCondition(size: number): boolean {
    return (size === (this.getConditionsSize() - 1) && (this.getConditionsSize() < this.maxListsConfig.conditions));
  }

  getConditionsSize(): number {
    return this.eventDayForm.baseForm.controls.condicionesEvento.value.length;
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

  getAssociationById(id: string): string {
    let asociacion: string;
    this.subscripcion.add(
      this.userSvc.getAssociationById(id).subscribe(association => {
        if (association) {
          asociacion = association.nombre;
        }
      }, (err) => {
        console.log('Get associations error! :> ', err);
      })
    );
    return asociacion;
  }

  getBondingTypesById(id: string): string {
    let bondingType: string;
    this.subscripcion.add(
      this.userSvc.getBondingTypeById(id).subscribe(BondingType => {
        if (BondingType) {
          bondingType = BondingType.nombre;
        }
      }, (err) => {
        console.log('Get bondingType error! :> ', err);
      })
    );
    return bondingType;
  }

  getAcademicProgramByCode(code: number): string {
    let program: string;
    this.subscripcion.add(
      this.userSvc.getAcademicProgramByCode(code).subscribe(Program => {
        if (Program) {
          program = Program.nombre;
        }
      }, (err) => {
        console.log('Get academic program error! :> ', err);
      })
    );
    return program;
  }

  onClose(close?: boolean): void {
    console.log(this.eventDayForm.baseForm.value);

    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.eventDayForm.onReset();
      this.dialogRef.close();

      const associations = this.eventDayForm.baseForm.controls.asociacion.value;
      const conditions = this.eventDayForm.baseForm.controls.condicionesEvento.value;

      for (const association of associations) {
        this.removeOrClearParameter(association, 'asociacion', true);
      }
      for (const condition of conditions) {
        this.removeOrClearParameter(condition, 'condicionesEvento', true);
      }
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

    this.authSvc.userResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRes: PlatformUserResponse) => {
        if (userRes) {
          this.platformUserData = userRes;
        }
      });

    this.eventDayForm.baseForm.controls.asociacion.setValue(this.platformUserData.asociacion);
    console.log(this.eventDayForm.baseForm.controls.asociacion.value);

    this.subscripcion.add(
      this.eventDaySvc.getConditions().subscribe(conditions => {
        if (conditions) {
          this.conditions = conditions;
        }
      }, (err) => {
        console.log('Get condition error! :> ', err);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
