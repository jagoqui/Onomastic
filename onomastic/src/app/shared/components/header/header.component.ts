import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  userData = {
    name: 'Jaidiver Gómez',
    email: 'jaidiver.gomez@udea.edu.co',
    role: 'ADMIN',
    verified: 'true'
  };
  isLogged = 'true';

  constructor() { }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout() { }

  ngOnInit(): void {
  }

}
