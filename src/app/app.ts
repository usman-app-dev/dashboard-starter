import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Shell } from '../core/layout/shell/shell';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Shell],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
