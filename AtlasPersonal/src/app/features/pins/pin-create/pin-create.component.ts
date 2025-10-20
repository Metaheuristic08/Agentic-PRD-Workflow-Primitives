import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pin-create',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h2>PinCreateComponent</h2><p>Componente en desarrollo</p></div>',
  styles: ['.container { padding: 2rem; } h2 { color: #1976d2; }']
})
export class PinCreateComponent {}
