import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import { EmailUsersService } from '../services/email-users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay = ['id', 'plataformaPorUsuarioCorreo', 'nombre', 'email', 'fechaNacimiento', 'vinculacionPorUsuarioCorreo', 'asociacionPorUsuarioCorreo', 'estado','actions'];
  dataSource = new MatTableDataSource();
  private destroy$ = new Subject<any>();

  constructor(private userSvc: EmailUsersService) { }


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
    // this.dialog.open(ModalComponent, {
    //   height: '400px',
    //   width: '600px',
    //   hasBackdrop: false,
    //   data: { title: 'New user', user },
    // });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((users) => {
      this.dataSource.data = users;
      console.log(users);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
