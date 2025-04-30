import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-donors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.scss']
})
export class DonorsComponent implements OnInit {
  donors: any[] = [];

  newDonor: any = {
    name: '',
    gender: '',
    citizenship: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    tajNumber: ''
  };

  constructor(
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDonors();
  }

  loadDonors() {
    this.http.get<any[]>('http://localhost:3000/donors').subscribe(data => {
      this.donors = data;
    });
  }

  validateTaj(tajNumber: string): boolean {
    if (!/^\d{9}$/.test(tajNumber)) {
      return false; 
    }

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      const digit = parseInt(tajNumber.charAt(i), 10);
      sum += (i % 2 === 0 ? 3 : 7) * digit;
    }
    const checkDigit = sum % 10;

    return checkDigit === parseInt(tajNumber.charAt(8), 10);
  }

  addDonor() {
    if (!this.validateTaj(this.newDonor.tajNumber)) {
      alert('Hibás TAJ szám! Kérlek, ellenőrizd!');
      return; 
    }

    this.http.post('http://localhost:3000/donors', this.newDonor).subscribe({
      next: () => {
        alert('Véradó sikeresen hozzáadva!');
        this.loadDonors();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Hiba történt a véradó rögzítésekor.');
      }
    });
  }

  resetForm() {
    this.newDonor = {
      name: '',
      gender: '',
      citizenship: '',
      birthPlace: '',
      birthDate: '',
      address: '',
      tajNumber: ''
    };
  }
}
