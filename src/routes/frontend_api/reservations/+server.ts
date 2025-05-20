import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample data
let reservations = [
  {
    ReservationID: 1,
    ConfirmationNumber: 'RES123456',
    StatusCode: 'confirmed',
    BookingChannelCode: 'DIRECT',
    PropertyID: 1,
    profile: {
      ProfileID: 101,
      EmailAddress: 'john.doe@example.com',
      PhoneNumber: '555-123-4567',
      nameInfo: {
        FirstName: 'John',
        LastName: 'Doe'
      }
    },
    reservationStay: {
      ArrivalDate: '2023-12-01',
      DepartureDate: '2023-12-05',
      roomType: {
        RoomTypeCode: 'DLX',
        Description: 'Deluxe Room'
      },
      room: {
        RoomNumber: '301'
      }
    }
  },
  {
    ReservationID: 2,
    ConfirmationNumber: 'RES654321',
    StatusCode: 'checked-in',
    BookingChannelCode: 'WEB',
    PropertyID: 1,
    profile: {
      ProfileID: 102,
      EmailAddress: 'jane.smith@example.com',
      PhoneNumber: '555-987-6543',
      nameInfo: {
        FirstName: 'Jane',
        LastName: 'Smith'
      }
    },
    reservationStay: {
      ArrivalDate: '2023-11-28',
      DepartureDate: '2023-12-02',
      roomType: {
        RoomTypeCode: 'STD',
        Description: 'Standard Room'
      },
      room: {
        RoomNumber: '205'
      }
    }
  },
  {
    ReservationID: 3,
    ConfirmationNumber: 'RES789012',
    StatusCode: 'cancelled',
    BookingChannelCode: 'OTA',
    PropertyID: 1,
    profile: {
      ProfileID: 103,
      EmailAddress: 'alex.wilson@example.com',
      PhoneNumber: '555-345-6789',
      nameInfo: {
        FirstName: 'Alex',
        LastName: 'Wilson'
      }
    },
    reservationStay: {
      ArrivalDate: '2023-12-10',
      DepartureDate: '2023-12-15',
      roomType: {
        RoomTypeCode: 'STE',
        Description: 'Suite'
      },
      room: {
        RoomNumber: '501'
      }
    }
  }
];

export const GET: RequestHandler = async ({ url }) => {
  // Get query parameters
  const confirmationNumber = url.searchParams.get('confirmationNumber');
  const lastName = url.searchParams.get('lastName');
  const arrivalDate = url.searchParams.get('arrivalDate');
  const status = url.searchParams.get('status');
  
  // Filter reservations based on query parameters
  let filteredReservations = [...reservations];
  
  if (confirmationNumber) {
    filteredReservations = filteredReservations.filter(r => 
      r.ConfirmationNumber.toLowerCase().includes(confirmationNumber.toLowerCase())
    );
  }
  
  if (lastName) {
    filteredReservations = filteredReservations.filter(r => 
      r.profile?.nameInfo?.LastName.toLowerCase().includes(lastName.toLowerCase())
    );
  }
  
  if (arrivalDate) {
    filteredReservations = filteredReservations.filter(r => 
      r.reservationStay?.ArrivalDate === arrivalDate
    );
  }
  
  if (status) {
    filteredReservations = filteredReservations.filter(r => 
      r.StatusCode.toLowerCase() === status.toLowerCase()
    );
  }
  
  return json(filteredReservations);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  
  // Create a new reservation
  const newReservation = {
    ReservationID: reservations.length + 1,
    ConfirmationNumber: data.ConfirmationNumber,
    StatusCode: 'confirmed',
    BookingChannelCode: data.BookingChannelCode,
    PropertyID: data.PropertyID,
    profile: {
      ProfileID: 100 + reservations.length + 1,
      EmailAddress: data.profile.EmailAddress,
      PhoneNumber: data.profile.PhoneNumber,
      nameInfo: {
        FirstName: data.profile.FirstName,
        LastName: data.profile.LastName
      }
    },
    reservationStay: {
      ArrivalDate: data.reservationStays[0].ArrivalDate,
      DepartureDate: data.reservationStays[0].DepartureDate,
      roomType: {
        RoomTypeCode: 'STD',
        Description: 'Standard Room'
      },
      room: {
        RoomNumber: `${Math.floor(Math.random() * 500) + 100}`
      }
    }
  };
  
  // Add to reservations array
  reservations.push(newReservation);
  
  return json({
    ReservationID: newReservation.ReservationID,
    confirmationNumber: newReservation.ConfirmationNumber,
    guestName: `${data.profile.FirstName} ${data.profile.LastName}`
  });
}; 