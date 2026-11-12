import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as L from 'leaflet';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';

/** Fallback view (Miraflores, Lima) when there is nothing to show. */
const DEFAULT_CENTER: L.LatLngExpression = [-12.1219, -77.0297];
const DEFAULT_ZOOM = 14;
const MAX_FIT_ZOOM = 16;
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

const priceLabel = (rate: number): string => `S/ ${rate.toFixed(2)}`;

/** Interactive map (Leaflet + OpenStreetMap): pan, zoom and click each space's price pin. */
@Component({
  selector: 'app-listing-map',
  imports: [TranslatePipe],
  templateUrl: './listing-map.html',
  styleUrl: './listing-map.css',
  encapsulation: ViewEncapsulation.None,
})
export class ListingMap {
  readonly listings = input.required<ParkingListing[]>();
  readonly highlightedId = input<number | null>(null);
  readonly listingSelected = output<ParkingListing>();

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private readonly ready = signal(false);
  private map?: L.Map;
  private readonly markers = new Map<number, L.Marker>();

  constructor() {
    afterNextRender(() => {
      this.map = L.map(this.container().nativeElement, { zoomControl: true, scrollWheelZoom: true })
        .setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(this.map);
      this.ready.set(true);
    });

    effect(() => {
      const listings = this.listings();
      if (this.ready()) this.renderMarkers(listings);
    });

    effect(() => {
      const id = this.highlightedId();
      if (this.ready()) this.applyHighlight(id);
    });

    inject(DestroyRef).onDestroy(() => {
      this.map?.remove();
      this.markers.clear();
    });
  }

  private renderMarkers(listings: ParkingListing[]): void {
    const map = this.map;
    if (!map) return;
    this.markers.forEach((marker) => marker.remove());
    this.markers.clear();

    for (const listing of listings) {
      const pin = document.createElement('span');
      pin.className = `pk-pin${listing.isAvailable ? '' : ' pk-pin--occupied'}`;
      pin.textContent = priceLabel(listing.hourlyRate);

      const marker = L.marker([listing.latitude, listing.longitude], {
        icon: L.divIcon({ className: 'pk-pin-wrap', html: pin, iconSize: [0, 0] }),
        title: listing.name,
        keyboard: true,
      }).addTo(map);

      // Built with DOM nodes (not HTML strings) so listing text is never interpreted as markup.
      const popup = document.createElement('div');
      popup.className = 'pk-popup';
      const name = document.createElement('strong');
      name.textContent = listing.name;
      const address = document.createElement('span');
      address.textContent = `${listing.address}, ${listing.district}`;
      popup.append(name, address);
      marker.bindPopup(popup);
      marker.on('click', () => this.listingSelected.emit(listing));
      this.markers.set(listing.id, marker);
    }

    this.fit(listings);
    this.applyHighlight(this.highlightedId());
  }

  private fit(listings: ParkingListing[]): void {
    const map = this.map;
    if (!map) return;
    if (listings.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    } else if (listings.length === 1) {
      map.setView([listings[0].latitude, listings[0].longitude], MAX_FIT_ZOOM);
    } else {
      map.fitBounds(
        L.latLngBounds(listings.map((l) => [l.latitude, l.longitude] as L.LatLngTuple)),
        { padding: [48, 48], maxZoom: MAX_FIT_ZOOM },
      );
    }
  }

  private applyHighlight(id: number | null): void {
    this.markers.forEach((marker, markerId) => {
      const active = markerId === id;
      marker.setZIndexOffset(active ? 1000 : 0);
      marker.getElement()?.querySelector('.pk-pin')?.classList.toggle('pk-pin--highlighted', active);
    });
    const target = id === null ? undefined : this.markers.get(id);
    if (target && this.map && !this.map.getBounds().contains(target.getLatLng())) {
      this.map.panTo(target.getLatLng());
    }
  }
}
