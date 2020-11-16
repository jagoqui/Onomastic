import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<string>(null);

  toggleDarkThemeControl = new FormControl(false);
  userData = {
    name: 'Jaidiver Gómez',
    email: 'jaidiver.gomez@udea.edu.co',
    role: 'ADMIN',
    verified: 'true'
  };
  isLogged = 'true';

  constructor(private overlayContainer: OverlayContainer) { }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout() { }

  ngOnInit(): void {
    this.toggleDarkThemeControl.valueChanges.subscribe((darkMode) => {
      this.toggleDarkTheme.emit(darkMode ? 'dark-theme' : 'light-theme');
    });
  }

}
