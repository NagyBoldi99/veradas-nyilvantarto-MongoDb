import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: Array<{ _id: number; name: string; address: string; active: boolean }> = [];
  newLocation = { name: '', address: '', active: true };

  constructor(
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  /** Backendből tölti be az összes helyszínt */
  loadLocations(): void {
    this.http.get<any[]>('http://localhost:3000/locations')
      .subscribe(data => this.locations = data);
  }

  /** Csak bejelentkezett felhasználó lássa az összest, vendégek csak az aktívakat */
  get visibleLocations() {
    return this.auth.isLoggedIn()
      ? this.locations
      : this.locations.filter(l => l.active);
  }

  /** Új helyszín felvitele a backendbe */
  addLocation(): void {
    this.http.post('http://localhost:3000/locations', this.newLocation)
      .subscribe({
        next: () => {
          this.loadLocations();
          this.newLocation = { name: '', address: '', active: true };
        },
        error: (err) => {
          console.error(err);
          alert('Hiba történt a helyszín hozzáadásakor.');
        }
      });
  }

  /** Státusz váltása backend PATCH-tel */
  toggleActive(loc: any): void {
    this.http.patch(`http://localhost:3000/locations/${loc._id}/toggle`, {})
      .subscribe({
        next: () => this.loadLocations(),
        error: err => console.error(err)
      });
  }
}
