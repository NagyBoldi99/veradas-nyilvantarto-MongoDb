import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:3000/auth/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Sikeres regisztráció!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Hiba történt a regisztráció során.')
    });
  }
}
