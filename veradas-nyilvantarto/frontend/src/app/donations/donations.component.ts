import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {


  donations: any[] = [];
  donors: any[] = [];
  locations: any[] = [];

  // Szűrők változói
  selectedDonorId: string = '';
  selectedLocationId: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  // Új véradás adatainak változói
  newDonation: any = {
    locationId: '',
    donorId: '',
    date: new Date().toISOString().split('T')[0], // alapértelmezett dátum: mai nap
    eligible: true,
    ineligibilityReason: '',
    doctorName: '',
    directedDonation: false,
    patientName: '',
    patientTaj: ''
  };

  constructor(
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDonations();
    this.loadDonors();
    this.loadLocations();
  }

  // Véradások listázása (összes vagy szűrt)
  loadDonations(): void {
    this.http.get<any[]>('http://localhost:3000/donations').subscribe(data => {
      this.donations = data;
    });
  }

  // Véradók betöltése
  loadDonors(): void {
    this.http.get<any[]>('http://localhost:3000/donors').subscribe(data => {
      this.donors = data;
    });
  }

  // Helyszínek betöltése
  loadLocations(): void {
    this.http.get<any[]>('http://localhost:3000/locations').subscribe(data => {
      this.locations = data;
    });
  }
  validateTaj(patientTaj: string): boolean {
    if (!/^\d{9}$/.test(patientTaj)) return false;
    const weights = [3, 7, 3, 7, 3, 7, 3, 7];
    const sum = patientTaj
      .split('')
      .slice(0, 8)
      .map((digit, i) => parseInt(digit) * weights[i])
      .reduce((a, b) => a + b, 0);
    const checkDigit = sum % 10;
    return checkDigit === parseInt(patientTaj[8]);
  }
  // Véradás hozzáadása
  addDonation() {
    // Ellenőrzés: ha nem alkalmas, de nincs ok
    if (!this.newDonation.eligible && !this.newDonation.ineligibilityReason) {
      alert('Kérlek add meg az alkalmatlanság okát!');
      return;
    }

    // Ellenőrzés: ha nem alkalmas, de irányított véradást jelölt be
    if (!this.newDonation.eligible && this.newDonation.directedDonation) {
      alert('Alkalmatlan donor nem adhat irányított vért!');
      return;
    }

    // Ellenőrzés: ha irányított véradás, akkor beteg név és TAJ kötelező
    if (this.newDonation.directedDonation) {
      if (!this.newDonation.patientName || !this.newDonation.patientTaj) {
        alert('Irányított véradás esetén a beteg neve és TAJ száma kötelező!');
        return;
      }
      if (!this.validateTaj(this.newDonation.patientTaj)) {
        alert('Hibás beteg TAJ szám!');
        return;
      }
    }

    // POST kérés a szerver felé
    this.http.post('http://localhost:3000/donations', this.newDonation).subscribe({
      next: () => {
        alert('Véradás sikeresen hozzáadva!');
        this.loadDonations();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Hiba történt a véradás rögzítésekor.');
      }
    });
  }

  // Form alaphelyzetbe állítása
  resetForm(): void {
    this.newDonation = {
      locationId: '',
      donorId: '',
      date: new Date().toISOString().split('T')[0],
      eligible: true,
      ineligibilityReason: '',
      doctorName: '',
      directedDonation: false,
      patientName: '',
      patientTaj: ''
    };
  }
  getDonorNameFromObject(donation: any): string {
    return donation.donor?.name ?? 'Ismeretlen véradó';
  }
  
  getLocationNameFromObject(donation: any): string {
    return donation.location?.name ?? 'Ismeretlen helyszín';
  }
  // Szűrés függvény
  filterDonations(): void {
    let url = 'http://localhost:3000/Donations?';
    const params: string[] = [];

    if (this.selectedDonorId) {
      params.push(`donorId=${this.selectedDonorId}`);
    }
    if (this.selectedLocationId) {
      params.push(`locationId=${this.selectedLocationId}`);
    }
    if (this.dateFrom) {
      params.push(`dateFrom=${this.dateFrom}`);
    }
    if (this.dateTo) {
      params.push(`dateTo=${this.dateTo}`);
    }

    url += params.join('&');

    this.http.get<any[]>(url)
      .subscribe(data => {
        this.donations = data;
      }, error => {
        console.error('Hiba a szűrt lekérdezésnél:', error);
        alert('Hiba történt a szűrés során.');
      });
  }
}
