import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Detailed sample data for a reservation
function getDetailedReservation(id: number) {
  // Mock data for individual reservation details
  const detailedReservations = {
    1: {
      ReservationID: 1,
      ConfirmationNumber: 'RES123456',
      StatusCode: 'confirmed',
      property: {
        PropertyName: 'Grand Hotel'
      },
      profile: {
        ProfileID: 101,
        EmailAddress: 'john.doe@example.com',
        PhoneNumber: '555-123-4567',
        nameInfos: [{
          FirstName: 'John',
          LastName: 'Doe'
        }]
      },
      creator: {
        FirstName: 'Admin',
        LastName: 'User'
      },
      reservationStays: [{
        ArrivalDate: '2023-12-01',
        DepartureDate: '2023-12-05',
        roomType: {
          RoomTypeCode: 'DLX',
          Description: 'Deluxe Room'
        },
        room: {
          RoomNumber: '301'
        },
        guestNameInfos: [{
          nameInfo: {
            FirstName: 'John',
            LastName: 'Doe'
          }
        }]
      }]
    },
    2: {
      ReservationID: 2,
      ConfirmationNumber: 'RES654321',
      StatusCode: 'checked-in',
      property: {
        PropertyName: 'Grand Hotel'
      },
      profile: {
        ProfileID: 102,
        EmailAddress: 'jane.smith@example.com',
        PhoneNumber: '555-987-6543',
        nameInfos: [{
          FirstName: 'Jane',
          LastName: 'Smith'
        }]
      },
      creator: {
        FirstName: 'Admin',
        LastName: 'User'
      },
      reservationStays: [{
        ArrivalDate: '2023-11-28',
        DepartureDate: '2023-12-02',
        roomType: {
          RoomTypeCode: 'STD',
          Description: 'Standard Room'
        },
        room: {
          RoomNumber: '205'
        },
        guestNameInfos: [{
          nameInfo: {
            FirstName: 'Jane',
            LastName: 'Smith'
          }
        }]
      }]
    },
    3: {
      ReservationID: 3,
      ConfirmationNumber: 'RES789012',
      StatusCode: 'cancelled',
      CancellationReason: 'Guest requested cancellation',
      CancellationDate: '2023-12-01',
      property: {
        PropertyName: 'Grand Hotel'
      },
      profile: {
        ProfileID: 103,
        EmailAddress: 'alex.wilson@example.com',
        PhoneNumber: '555-345-6789',
        nameInfos: [{
          FirstName: 'Alex',
          LastName: 'Wilson'
        }]
      },
      creator: {
        FirstName: 'Admin',
        LastName: 'User'
      },
      reservationStays: [{
        ArrivalDate: '2023-12-10',
        DepartureDate: '2023-12-15',
        roomType: {
          RoomTypeCode: 'STE',
          Description: 'Suite'
        },
        room: {
          RoomNumber: '501'
        },
        guestNameInfos: [{
          nameInfo: {
            FirstName: 'Alex',
            LastName: 'Wilson'
          }
        }]
      }]
    }
  };
  
  return detailedReservations[id as keyof typeof detailedReservations];
}

// GET a single reservation
export const GET: RequestHandler = async ({ params }) => {
  const id = Number(params.id);
  
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const reservation = getDetailedReservation(id);
  
  if (!reservation) {
    return new Response(JSON.stringify({ error: 'Reservation not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  return json(reservation);
};

// PATCH to update a reservation
export const PATCH: RequestHandler = async ({ params, request }) => {
  const id = Number(params.id);
  
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const reservation = getDetailedReservation(id);
  
  if (!reservation) {
    return new Response(JSON.stringify({ error: 'Reservation not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const data = await request.json();
  
  // Update reservation notes or stays
  if (data.notes) {
    // In a real implementation, we would save this
    console.log(`Updated notes for reservation ${id}: ${data.notes}`);
  }
  
  if (data.stays && Array.isArray(data.stays)) {
    // In a real implementation, we would update the stays
    console.log(`Updated stays for reservation ${id}`);
  }
  
  return json(reservation);
};

// DELETE to cancel a reservation
export const DELETE: RequestHandler = async ({ params, request }) => {
  const id = Number(params.id);
  
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const reservation = getDetailedReservation(id);
  
  if (!reservation) {
    return new Response(JSON.stringify({ error: 'Reservation not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const data = await request.json();
  
  // Update the reservation status to cancelled
  reservation.StatusCode = 'cancelled';
  reservation.CancellationReason = data.reason || 'No reason provided';
  reservation.CancellationDate = new Date().toISOString().split('T')[0];
  
  return json({ message: 'Reservation cancelled successfully' });
}; 