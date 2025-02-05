import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NavComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render nav and router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav')).toBeTruthy(); // Check for NavComponent
    expect(compiled.querySelector('router-outlet')).toBeTruthy(); // Check for router-outlet
  });
});
