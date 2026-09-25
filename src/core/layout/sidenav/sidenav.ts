import { Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ThemeService } from '../../theme/theme.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  host: { '[class.collapsed]': 'collapsed()' },
})
export class Sidenav {
  protected readonly theme = inject(ThemeService);

  readonly collapsed = model(false);

  protected readonly navItems: NavItem[] = [{ label: 'Home', icon: 'home', route: '/' }];
}
