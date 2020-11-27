import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild(MatSort) sort: MatSort;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  onOpenModal(user = {}): void {
    this.dialog.open(ModalMailUsersComponent, {
      hasBackdrop: true,
      data: { title: user ? 'Actualizar destinario' : 'Nuevo destinario', user },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((users) => {
      this.dataSource.data = users;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
