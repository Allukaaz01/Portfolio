export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string; // Date of arrival / Check-in
  checkOut: string; // Date of departure / Check-out
  surgeryType: 'primary' | 'revision' | 'ethnic' | 'septoplasty' | 'other';
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  hotelSentStatus: boolean;
  hotelEmailSentTo?: string;
  hotelSentAt?: string;
  hotelComments?: string;
  archived?: boolean;
}

export interface AppSettings {
  notificationEmail: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  caption: string;
  permalink: string;
  date: string;
}

export interface HotelDispatchPayload {
  bookingId: string;
  hotelEmail: string;
  messageBody: string;
  additionalNotes?: string;
}
