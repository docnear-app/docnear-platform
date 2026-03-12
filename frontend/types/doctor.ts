export interface DoctorListing {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: {
    city: string;
    district: string;
  };
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  isAvailableToday: boolean;
  languages: string[];
  experience: number;
  gender: 'male' | 'female';
  qualifications: string[];
  bio: string;
}

export interface DoctorFilterState {
  search: string;
  city: string;
  specialties: string[];
  employmentTypes: string[];
  priceMin: string;
  priceMax: string;
  maxPrice: number | null;
  minRating: number | null;
  availability: boolean;
  gender: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: {
    city: string;
    district: string;
  };
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  isAvailableToday: boolean;
  languages: string[];
  experience: number;
  gender: 'male' | 'female';
}

export type DoctorSortOption = 'rating' | 'price_asc' | 'price_desc' | 'experience';
