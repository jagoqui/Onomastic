import { Component, OnInit } from '@angular/core';
import { strict } from 'assert';
declare var require: any;
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  version = environment.appVersion;

  constructor() { }

  ngOnInit(): void {

  }


}
