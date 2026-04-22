import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SidenavComponent,
    HeaderComponent
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'] // Ensure this is linked!
})
export class ShellComponent {
  // Defaulting to true so it's open on load
  sidebarOpen = true; 

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}