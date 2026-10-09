import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpace } from '../../../domain/model/parking-space.entity';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceCard } from './parking-space-card';

describe('ParkingSpaceCard', () => {
  let component: ParkingSpaceCard;
  let fixture: ComponentFixture<ParkingSpaceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceCard],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceCard);
    fixture.componentRef.setInput(
      'parkingSpace',
      new ParkingSpace(1, 1, 'Test address', [], 10, []),
    );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request pausing a published parking space', () => {
    let statusChange: { id: number; status: string } | undefined;
    component.publicationStatusChange.subscribe((event) => {
      statusChange = event;
    });

    const button = fixture.nativeElement.querySelector('.status-toggle') as HTMLButtonElement;
    button.click();

    expect(statusChange).toEqual({ id: 1, status: 'paused' });
  });
});
