// Types based on API documentation and requirements

export type ReservationStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export type BookingChannel = 'DIRECT' | 'WEB' | 'OTA';

export type NameInfo = {
	NameInfoID: number;
	ProfileID: number;
	NamePrefix?: string;
	FirstName: string;
	MiddleName?: string;
	LastName: string;
	NameSuffix?: string;
	IsPrimary: boolean;
	CreatedAt: string;
	UpdatedAt: string;
};

export type Profile = {
	ProfileID: number;
	ProfileTypeCode: string;
	ProfileStatusCode: string;
	VIPStatusCode: string;
	IsAnIndividual: boolean;
	EmailAddress: string;
	PhoneNumber: string;
	CountryOfResidence: string;
	Nationality: string;
	BirthDate: string;
	GenderCode: string;
	Notes: string;
	CreatedAt: string;
	UpdatedAt: string;
	nameInfos: NameInfo[];
	nameInfo: NameInfo;
};

export type RoomType = {
	RoomTypeID: number;
	PropertyID: number;
	RoomTypeCode: string;
	Description: string;
	MaxOccupancy: number;
	BedType?: string;
	StandardRate: string;
	CreatedAt: string;
	UpdatedAt: string;
};

export type Room = {
	RoomID: number;
	RoomNumber: string;
};

export type ReservationStay = {
	ReservationStayID: number;
	ReservationID: number;
	RoomTypeID: number;
	RoomID?: number;
	ArrivalDate: string;
	DepartureDate: string;
	AdultCount: number;
	ChildCount: number;
	RateAmount: string;
	StatusCode: string;
	Notes?: string;
	CreatedAt: string;
	UpdatedAt: string;
	CreatedBy: number;
	roomType: RoomType;
	room?: Room;
	guestNameInfos: Array<{
		nameInfo: {
			FirstName: string;
			LastName: string;
			NamePrefix?: string;
		};
	}>;
};

export type Property = {
	PropertyID: number;
	PropertyCode: string;
	PropertyName: string;
	Address?: string;
	City: string;
	State?: string;
	Country: string;
	PostalCode?: string;
	Phone?: string;
	Email?: string;
	CheckInTime: string;
	CheckOutTime: string;
	CreatedAt: string;
	UpdatedAt: string;
};

export type Reservation = {
	ReservationID: number;
	ProfileID: number;
	PropertyID: number;
	ConfirmationNumber: string;
	ReservationDate: string;
	BookingChannelCode: BookingChannel;
	StatusCode: ReservationStatus;
	CancellationDate: string | null;
	CancellationReason: string | null;
	Notes: string;
	CreatedAt: string;
	UpdatedAt: string;
	CreatedBy: number;
	profile: Profile;
	property: Property;
	reservationStays: ReservationStay[];
	reservationStay: ReservationStay;
};

export type DetailedReservation = Reservation & {
	creator: {
		FirstName: string;
		LastName: string;
	};
	folios: Array<{
		FolioStayID: number;
		ReservationStayID: number;
		Status: string;
		Amount: string;
		Source: string;
		FolioType: string;
		CreatedAt: string;
		UpdatedAt: string;
		UpdatedBy: number | null;
	}>;
};

export type CreateReservationRequest = {
	profileId?: number;
	PropertyID?: number;
	bookingChannel?: BookingChannel;
	notes?: string;
	stays: Array<{
		roomTypeId: number;
		arrivalDate: string;
		departureDate: string;
		adultCount?: number;
		childCount?: number;
		rateAmount: number | string;
		guestNames?: Array<{
			nameInfoId: number;
			isPrimaryGuest?: boolean;
		}>;
	}>;
	guestInfo?: {
		firstName: string;
		lastName: string;
		email?: string;
		phoneNumber?: string;
		address?: {
			addressLine1?: string;
			addressLine2?: string;
			city?: string;
			stateProvince?: string;
			postalCode?: string;
			country?: string;
		};
		namePrefix?: string;
		nameSuffix?: string;
		middleName?: string;
		ProfileTypeCode?: string;
		ProfileStatusCode?: string;
	};
};

export type ReservationFilter = {
	confirmationNumber?: string;
	lastName?: string;
	arrivalDate?: string;
	status?: ReservationStatus;
	propertyId?: number;
	bookingChannel?: BookingChannel;
};

export type CheckInRequest = {
	roomId: number;
	guestDetails: {
		useReservedGuest: boolean;
		guests: Array<{
			firstName: string;
			lastName: string;
			idType?: string;
			idNumber?: string;
			isPrimary: boolean;
		}>;
	};
	paymentMethod: string;
	specialRequests?: string;
};

export type CheckInResponse = {
	message: string;
	reservation: DetailedReservation;
};

export type CheckOutResponse = {
	message: string;
	reservation: DetailedReservation;
};

export type CancelReservationRequest = {
	reason: string;
};

export type CancelReservationResponse = {
	message: string;
};

export type ProfileTypeCode = 'GUEST' | 'STAFF' | 'AGENT';

export type ProfileStatusCode = 'Active' | 'Inactive' | 'Blocked';

export type VIPStatusCode = 'NONE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type ProfileAddress = {
	addressLine1?: string;
	addressLine2?: string;
	city: string;
	stateProvince?: string;
	postalCode?: string;
	country: string;
};

export type ProfileInput = {
	firstName: string;
	lastName: string;
	email?: string;
	phoneNumber?: string;
	address?: ProfileAddress;
	namePrefix?: string;
	nameSuffix?: string;
	middleName?: string;
	ProfileTypeCode?: ProfileTypeCode;
	ProfileStatusCode?: ProfileStatusCode;
	CountryOfResidence?: string;
	Nationality?: string;
	BirthDate?: string;
	GenderCode?: string;
	Notes?: string;
};

export type UserProfile = {
	ProfileID: number;
	EmailAddress: string;
	PhoneNumber: string;
	CreatedAt: string;
	VIPStatusCode: VIPStatusCode;
	FirstName: string;
	LastName: string;
	NameInfoID: number;
};

export type ProfileResponse = {
	ProfileID: number;
	ProfileTypeCode: ProfileTypeCode;
	ProfileStatusCode: ProfileStatusCode;
	VIPStatusCode: VIPStatusCode;
	IsAnIndividual: boolean;
	EmailAddress: string;
	PhoneNumber: string;
	CountryOfResidence: string;
	Nationality: string;
	BirthDate: string;
	GenderCode: string;
	Notes: string;
	CreatedAt: string;
	UpdatedAt: string;
	nameInfos: NameInfo[];
	nameInfo: NameInfo;
};

export type ProfileListResponse = Array<UserProfile>;
