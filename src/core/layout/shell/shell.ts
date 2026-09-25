import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Header } from '../header/header';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-shell',
  imports: [Header, MatSidenavModule, Sidenav],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly collapsed = signal(false);
}
