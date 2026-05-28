import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Register} from './pages/register/register';
import {Login} from './pages/login/login';
import {Devis} from './pages/devis/devis';
import {Formation} from './pages/formation/formation';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'devis/:pole', component: Devis },
  { path: 'formation', component: Formation }
];
