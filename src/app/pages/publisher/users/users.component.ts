import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import { EmailUsersService } from '../services/email-users.service';
import {
  ModalMailUsersComponent,
} from './components/modal-mail-users/modal-mail-users.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private numUsers = 0;
  columnsToDisplay = [
    'id', 'plataformaPorUsuarioCorreo',
    'nombre', 'email', 'fechaNacimiento',
    'vinculacionPorUsuarioCorreo',
    'asociacionPorUsuarioCorreo',
    'estado', 'actions'
  ];
  dataSource = new MatTableDataSource();
  private destroy$ = new Subject<any>();

  constructor(private dialog: MatDialog, private userSvc: EmailUsersService) { }

  getParcialUsers(): string {
    let x = ('' + this.numUsers).length;
    const p = Math.pow;
    const d = p(10, 1);
    x -= x % 3;
    return Math.round(this.numUsers * d / p(10, x)) / d + ' kMGTPE'[x / 3];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onOpenModal(user = {}): void {
    this.dialog.open(ModalMailUsersComponent, {
      hasBackdrop: true,
      disableClose: true,
      height: 'auto',
      width: '45%',
      data: { title: user ? 'Actualizar destinatario' : 'Nuevo destinatario', user },
    });
  }

  getPageSizeOptions(): number[] {
    const maxall = 100;
    if (this.dataSource.data.length > maxall) {
      return [5, 10, 20, 50, this.dataSource.data.length];
    } else {
      return [5, 10, 20, 50, maxall];
    }
  }

  onDelete(userId: number): void {
    // if (window.confirm('Do you really want remove this user')) {
    //   this.userSvc
    //     .delete(userId)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((res) => {
    //       window.alert(res);
    //     });
    // }
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getPageSizeOptions();
  }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((user) => {
      this.dataSource.data = user;
      this.numUsers = this.dataSource.data.length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
