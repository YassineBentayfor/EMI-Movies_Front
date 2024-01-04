import {Component, signal} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dialog-login',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterLink],
  templateUrl: './dialog-login.component.html',
  styleUrl: './dialog-login.component.css',
})
export class DialogLoginComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    private router: Router
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  navigateToSignUp(): void {
    this.dialogRef.close();
    this.router.navigate(['/signup']);
  }
}
