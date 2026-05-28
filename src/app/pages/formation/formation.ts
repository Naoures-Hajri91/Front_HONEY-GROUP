import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

interface LanguageCourse {
  name: string;
  flagIcon: string;
  image: string;
  tagline: string;
  description: string;
}

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Footer
  ],
  templateUrl: './formation.html',
  styleUrl: './formation.css'
})
export class Formation implements OnInit {
  
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Force la détection des changements immédiatement et après chargement pour afficher les drapeaux et vidéos instantanément
    this.cdr.detectChanges();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  // Logo Path compatible avec le Header
  logoPath = 'assets/images/logo-honey-group.jpg';

  // Photo d'accueil générale
  heroImage = 'assets/images/formation_general.jpg';

  // Liste des cours de langues pour affichage dynamique (Bonne Pratique Angular)
  languages: LanguageCourse[] = [
    {
      name: 'Français',
      flagIcon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/1x1/fr.svg',
      image: 'assets/images/french.jpg',
      tagline: 'Maîtrisez la langue de Molière pour vos opportunités internationales.',
      description: 'Perfectionnez votre expression orale et écrite, développez votre fluidité conversationnelle et préparez-vous sereinement aux certifications officielles (DELF/DALF) pour dynamiser votre carrière.'
    },
    {
      name: 'Anglais',
      flagIcon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/1x1/gb.svg',
      image: 'assets/images/english.jpg',
      tagline: 'Ouvrez les portes du monde avec l’anglais professionnel.',
      description: 'Développez vos compétences en communication internationale, assimilez le vocabulaire professionnel spécifique à votre secteur et participez activement à des simulations de projets réels.'
    },
    {
      name: 'Allemand',
      flagIcon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/1x1/de.svg',
      image: 'assets/images/german.jpg',
      tagline: 'Boostez votre carrière au cœur de l’économie européenne.',
      description: 'Initiez-vous ou perfectionnez-vous aux bases stratégiques de la langue allemande (Deutschkurs A1 Grundlagen), gagnez en aisance relationnelle et accédez à de nouvelles opportunités d’affaires.'
    },
    {
      name: 'Mandarin',
      flagIcon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/1x1/cn.svg',
      image: 'assets/images/mandarin.jpg',
      tagline: 'Prenez une longueur d’avance avec la langue du futur.',
      description: 'Maîtrisez l’art des tons, écrivez les caractères fondamentaux, assimilez le pinyin et apprenez l’étiquette des affaires (Business Etiquette) incontournable pour vos échanges avec la Chine.'
    }
  ];

  // Sécurisation des URLs YouTube (Bonne Pratique de Protection XSS Angular)
  englishVideoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/d0yGdNEWdn0');
  mandarinVideoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/_HIUPMevWno');
}
