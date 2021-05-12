import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { EventDayService } from '../shared/services/event-day.service';
import { ModalEventDayComponent } from './components/modal-event-day/modal-event-day.component';
import { SafeHtml } from '@angular/platform-browser';
import SwAlert from 'sweetalert2';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { TemplateCard } from '@pages/admin/shared/models/template-card.model';
import { EventDay } from '@pages/admin/shared/models/event-day.model';
import { DomSanitizerService } from '@appShared/services/dom-sanitizer.service';

@Component({
  selector: 'app-events-day',
  templateUrl: './events-day.component.html',
  styleUrls: ['./events-day.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class EventsDayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'nombre', 'fecha',
    'recurrencia',
    'estado'
  ];
  cards: TemplateCard[];
  expandedElement: EventDay;
  private numEvents = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private eventsSvc: EventDayService,
    private domSanitizerSvc: DomSanitizerService) {
  }

  onOpenModal(event = {}): void {
    const dialogRef = this.dialog.open(ModalEventDayComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: event ? 'EDITAR EVENTO' : 'NUEVO EVENTO', event }
    });
    if (dialogRef.afterClosed()) {
      dialogRef.componentInstance.refresh.subscribe((refresh) => {
        if (refresh) {
          this.onRefresh();
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sanitizeHTML(card: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(card);
  }

  onEventStateChange(id: number, state: string) {
    if (state === 'ACTIVO') {
      this.eventsSvc.inactivateEvent(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event) {
            SwAlert.fire(`El evento se ha desactivado! `, '', 'success')
              .then(_ => {
                this.onRefresh();
              });
          }
        }, () => {
          Swal.showValidationMessage(
            'Error desactivando evento');
        });
    } else {
      this.eventsSvc.activateEvent(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event) {
            SwAlert.fire(`El evento se ha activado! `, '', 'success')
              .then(_ => {
                this.onRefresh();
              });
          }
        }, () => {
          Swal.showValidationMessage(
            'Error activando evento');
        });
    }
  }

  onDelete(eventId): void {
    SwAlert.fire({
      title: 'Está seguro?',
      text: 'Si elimina este evento los cambios no podrán revertirse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((resultDelete) => {
      if (resultDelete.isConfirmed) {
        this.eventsSvc.delete(eventId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((_) => {
            SwAlert.fire(`El evento fue eliminado! `, '', 'success')
              .then(_ => {
                this.onRefresh();
              });
          }, () => {
            Swal.showValidationMessage(
              'Error eliminando evento');
          });
      }
    });
  }

  onRefresh(refreshEvent?: boolean): void {
    if (refreshEvent || refreshEvent !== false) {
      this.destroy$.next({});
      this.destroy$.complete();
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.eventsSvc.getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.dataSource.data = event;
        this.numEvents = this.dataSource.data.length;
      }, () => {
        Swal.showValidationMessage(
          'Error cargando los eventos');
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
