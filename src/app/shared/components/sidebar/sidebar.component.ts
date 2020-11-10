import { Component, OnInit } from '@angular/core';

import {
  SidenavControllerService,
} from '../../services/sidenav-controller.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private sidenavController: SidenavControllerService) { }

  onExit(): void {
    // this.authSvc.logout();
    this.sidenavController.openSidebar(false);
  }

  ngOnInit(): void {
  }

}
