import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const id = Number(params.id);
  
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // In a real implementation, we would update the reservation status
  console.log(`Checked out reservation ${id}`);
  
  // Return a success response with mock reservation data
  return json({
    message: 'Guest checked out successfully',
    reservation: {
      ReservationID: id,
      ConfirmationNumber: `RES${100000 + id}`,
      StatusCode: 'checked-out',
      property: {
        PropertyName: 'Grand Hotel'
      },
      profile: {
        ProfileID: 100 + id,
        EmailAddress: 'guest@example.com',
        PhoneNumber: '555-123-4567',
        nameInfos: [{
          FirstName: 'Guest',
          LastName: 'User'
        }]
      },
      reservationStays: [{
        ArrivalDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        DepartureDate: new Date().toISOString().split('T')[0],
        roomType: {
          RoomTypeCode: 'STD',
          Description: 'Standard Room'
        },
        room: {
          RoomNumber: '101'
        },
        guestNameInfos: [{
          nameInfo: {
            FirstName: 'Guest',
            LastName: 'User'
          }
        }]
      }]
    }
  });
}; 