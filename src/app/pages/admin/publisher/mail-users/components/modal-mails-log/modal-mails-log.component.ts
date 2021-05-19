import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from '@adminShared/models/shared.model';
import { MatTableDataSource } from '@angular/material/table';
import { endWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import SwAlert from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MailsLogService } from '@app/pages/admin/shared/services/mails-log.service';
import { MatPaginator } from '@angular/material/paginator';
import { MailsLog } from '@app/pages/admin/shared/models/mails-log.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-mais-log',
  templateUrl: './modal-mails-log.component.html',
  styleUrls: ['./modal-mails-log.component.scss'],
  providers: [DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ]
})
export class ModalMailsLogComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnsToDisplay = [
    'fecha', 'email', 'asunto'
  ];
  dataSource = new MatTableDataSource();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  private numMails = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalMailsLogComponent>,
    private mailSentSvc: MailsLogService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  changeRangeDate(){
    const start = this.datePipe.transform(this.range.get('start').value, 'yyyy-MM-dd');
    const end = this.datePipe.transform(this.range.get('end').value, 'yyyy-MM-dd');
    const rangeUpdt = new FormGroup({
      start: new FormControl(start),
      end: new FormControl(end)
    });
    console.log((rangeUpdt.value));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.mailSentSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mail) => {
        this.dataSource.data = mail;
        this.numMails = this.dataSource.data.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando el historial');
      });
    this.mailSentSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataSent) => {
        this.numMails = dataSent.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando las los correos enviados');
      });
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      this.dataSource.filterPredicate = function(data: MailsLog, filter: string): boolean{
        return data.asunto.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
      };
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
