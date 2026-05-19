import { Component, signal } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {Home} from './pages/home/home';
import {ReactiveFormsModule} from '@angular/forms';
import { authInterceptor } from './services/auth.interceptor';

@Component({
  selector: 'app-root',
  imports: [  ReactiveFormsModule,RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Honey_Group');
}
