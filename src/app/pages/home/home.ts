import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Poles } from '../../services/poles';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Header,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private poleService = inject(Poles);

  poles: any[] = [];

  ngOnInit(): void {
    this.poleService.getAllPoles().subscribe(data => {
      this.poles = data;
    });
  }

  getImage(nom: string): string {
    switch (nom) {
      case 'IT & Digital':
        return 'assets/images/it.png';

      case 'Ecotourisme':
        return 'assets/images/tourisme.png';

      case 'Événementiel':
        return 'assets/images/event.png';

      case 'Formation':
        return 'assets/images/formation.png';

      default:
        return 'assets/images/default.png';
    }
  }

  getIcon(nom: string): string {
    switch (nom) {
      case 'IT & Digital': return '💻';
      case 'Ecotourisme': return '🌍';
      case 'Événementiel': return '📅';
      case 'Formation': return '🎓';
      default: return '⭐';
    }
  }
}
