// Types based on API documentation

export type Reservation = {
  ReservationID: number;
  ConfirmationNumber: string;
  StatusCode: string;
  BookingChannelCode: string;
  PropertyID: number;
  profile?: {
    ProfileID: number;
    EmailAddress?: string;
    PhoneNumber?: string;
    nameInfo?: {
      FirstName: string;
      LastName: string;
      NamePrefix?: string;
    };
  };
  reservationStay?: {
    ArrivalDate: string;
    DepartureDate?: string;
    roomType?: {
      RoomTypeCode: string;
      Description: string;
    };
    room?: {
      RoomNumber: string;
    };
  };
};

export type DetailedReservation = {
  ReservationID: number;
  ConfirmationNumber: string;
  StatusCode: string;
  CancellationReason?: string;
  CancellationDate?: string;
  property: {
    PropertyName: string;
  };
  profile: {
    ProfileID: number;
    EmailAddress?: string;
    PhoneNumber?: string;
    nameInfos: Array<{
      FirstName: string;
      LastName: string;
      NamePrefix?: string;
    }>;
  };
  creator?: {
    FirstName: string;
    LastName: string;
  };
  reservationStays: Array<{
    ArrivalDate: string;
    DepartureDate: string;
    roomType: {
      RoomTypeCode: string;
      Description: string;
    };
    room: {
      RoomNumber: string;
    };
    guestNameInfos: Array<{
      nameInfo: {
        FirstName: string;
        LastName: string;
        NamePrefix?: string;
      };
    }>;
  }>;
};

export type CreateReservationRequest = {
  ConfirmationNumber: string;
  profile: {
    FirstName: string;
    LastName: string;
    EmailAddress?: string;
    PhoneNumber?: string;
  };
  reservationStays: Array<{
    ArrivalDate: string;
    DepartureDate: string;
    RoomTypeID: number;
    RoomID?: number;
  }>;
  BookingChannelCode: string;
  PropertyID: number;
};

export type ReservationStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export type ReservationFilter = {
  confirmationNumber?: string;
  lastName?: string;
  arrivalDate?: string;
  status?: string;
}; 