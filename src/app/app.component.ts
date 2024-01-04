import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { DialogLoginComponent } from './shared/dialog-login/dialog-login.component';
import { FilmService } from './Service/film.service';
import { UsersloginService } from './Service/users.login.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'movie-app';
  private destroy$: Subject<void> = new Subject<void>();
  isAuthenticated = false;
  userSub: Subscription;
  constructor(
    private userLoginService: UsersloginService,
    private router: Router,

    public dialog: MatDialog,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.userLoginService.autoLogin();
    this.userSub = this.userLoginService.userSubject.subscribe((user) => {
      console.log('user', user);
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSub.unsubscribe();
  }
  onOpenFavorites() {
    console.log('this.isAuthenticated', this.isAuthenticated);
    if (this.isAuthenticated) {
      this.router.navigate(['/favorited']);
    } else {
      {
        const dialogRef = this.dialog.open(DialogLoginComponent);

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.router.navigate(['/signup']);
          }
        });
      }
    }
  }
  onLogout() {
    this.userLoginService.logout();
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
}
