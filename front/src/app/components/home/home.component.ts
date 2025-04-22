import { Component, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var $: any; // Declare jQuery to avoid TypeScript errors

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  standalone: true
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  
  constructor() { }

  ngAfterViewInit(): void {
    // Initialize the testimonial carousel with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.initCarousel();
    }, 100);
  }

  ngOnDestroy(): void {
    // Destroy the carousel when component is destroyed to prevent memory leaks
    $('.testimonial-wrap-2').slick('unslick');
  }

  private initCarousel(): void {
    // Initialize the testimonial carousel
    $('.testimonial-wrap-2').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
      infinite: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }
}
