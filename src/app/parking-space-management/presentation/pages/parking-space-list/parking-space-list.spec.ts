import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceList } from './parking-space-list';

describe('ParkingSpaceList', () => {
  let component: ParkingSpaceList;
  let fixture: ComponentFixture<ParkingSpaceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceList],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link publication actions to the owner creation route', () => {
    fixture.detectChanges();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a.publish-button'),
    ).map((link) => link.getAttribute('href'));

    expect(links.length).toBeGreaterThan(0);
    expect(links.every((href) => href === '/owner/parking-spaces/new')).toBe(true);
  });
});
