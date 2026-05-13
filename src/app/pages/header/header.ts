import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  logoPath = 'assets/images/logo-honey-group.jpg';

  ngOnInit(): void {
    console.log(this.logoPath);
  }
}
