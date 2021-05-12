import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from '@adminShared/models/shared.model';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import SwAlert from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MailsLogService } from '@app/pages/admin/shared/services/mails-log.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-modal-mais-log',
  templateUrl: './modal-mails-log.component.html',
  styleUrls: ['./modal-mails-log.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ]
})
export class ModalMailsLogComponent implements OnInit, AfterViewInit {
  @Output() refresh = new EventEmitter<boolean>(false);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnsToDisplay = [
    'fecha', 'email', 'asunto'
  ];
  dataSource = new MatTableDataSource();
  private numMails = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalMailsLogComponent>,
    private mailSentSvc: MailsLogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
