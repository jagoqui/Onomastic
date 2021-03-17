import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { EventDayService } from '../services/event-day.services';
import { ModalEventDayComponent } from './components/modal-event-day/modal-event-day.component';
import { DomSanitizerService } from '@app/shared/services/dom-sanitizer.service';
import { SafeHtml } from '@angular/platform-browser';
import { Plantilla } from '@app/shared/models/template-card.model';
import { EventDay } from '@app/shared/models/event-day.model';

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
    'estado','acciones'
  ];
  cards: Plantilla[];
  expandedElement: EventDay;
  private numEvents = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private eventsSvc: EventDayService,
    private domSanitizerSvc: DomSanitizerService) {
  }

  ngOnInit(): void {
    this.eventsSvc.getEvents().subscribe((event) => {
      this.dataSource.data = event;
      console.log(this.dataSource.data);
      this.numEvents = this.dataSource.data.length;
    });
  }

  onOpenModal(event = {}): void {
    this.dialog.open(ModalEventDayComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: event ? 'EDITAR EVENTO' : 'NUEVO EVENTO', event }
    });
  }

  getPageSizeOptions(): number[] {
    const maxAll = 100;
    if (this.dataSource.data.length > maxAll) {
      return [5, 10, 20, 50, this.dataSource.data.length];
    } else {
      return [5, 10, 20, 50, maxAll];
    }
  }

  onDelete(eventId): void {
    if (window.confirm('Esta seguro que desea eliminar éste evento?')) {
      // this.eventsSvc
      //   .delete(eventId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((res) => {
      //     this.ngOnInit();
      //     window.alert('Evento eliminado!');
      //   }, (err) => {
      //     console.log('Error en eliminar el evento! :> ', err);
      //   });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onRefresh(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getPageSizeOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  sanitizeHTML(card: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(card);
  }

}
