import { Component, signal } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {Home} from './pages/home/home';
import {ReactiveFormsModule} from '@angular/forms';
import { authInterceptor } from './services/auth.interceptor';
import { Header } from './pages/header/header'; 
import { Footer } from './pages/footer/footer';

@Component({
  selector: 'app-root',
  imports: [  ReactiveFormsModule,RouterOutlet, RouterModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Honey_Group');
}
