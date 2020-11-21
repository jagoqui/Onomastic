import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HeaderFooterViewControllerService,
} from 'src/app/shared/services/header-footer-view-controller.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  constructor(private headerFooterViewController: HeaderFooterViewControllerService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.headerFooterViewController.setShowHeaderFooter(true);
  }
}
