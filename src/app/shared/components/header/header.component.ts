import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  ThemeSwitcherControllerService,
} from '../../services/theme-switcher-controller.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  toggleDarkThemeControl = new FormControl(false);
  userData = {
    name: 'Jaidiver Gómez',
    email: 'jaidiver.gomez@udea.edu.co',
    role: 'ADMIN',
    verified: 'true'
  };
  isLogged = 'true';

  constructor(private overlayContainer: OverlayContainer, private themeSwitcher: ThemeSwitcherControllerService) { }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout() { }

  ngOnInit(): void {
    this.toggleDarkThemeControl.valueChanges.subscribe((darkMode) => {
      this.themeSwitcher.setThemeClass(darkMode ? 'dark-theme' : 'light-theme');
    });
  }

}
