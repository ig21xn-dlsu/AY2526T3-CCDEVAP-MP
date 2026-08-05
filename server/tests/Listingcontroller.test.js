

const mongoose = require('mongoose');

jest.mock('../models/Listing');
jest.mock('../models/Group');

const Listing = require('../models/Listing');
const listingController = require('../controllers/listingController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq(overrides = {}) {
  return {
    params: {},
    body: {},
    user: { _id: 'user123' },
    ...overrides,
  };
}

const VALID_ID = new mongoose.Types.ObjectId().toString();
const OTHER_VALID_ID = new mongoose.Types.ObjectId().toString();
const INVALID_ID = 'not-a-valid-id';

afterEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
describe('getListingOwner', () => {
  test('returns 200 and the list of listings owned by the logged-in user', async () => {
    const fakeListings = [{ roomTitle: 'Room A' }, { roomTitle: 'Room B' }];
    Listing.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeListings),
    });

    const req = mockReq();
    const res = mockRes();

    await listingController.getListingOwner(req, res);

    expect(Listing.find).toHaveBeenCalledWith({ owner: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeListings);
  });

  test('returns 500 when the database call throws', async () => {
    Listing.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB is down')),
    });

    const req = mockReq();
    const res = mockRes();

    await listingController.getListingOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB is down' });
  });
});

// ---------------------------------------------------------------------------
describe('createListing', () => {
  const validBody = {
    roomTitle: 'Cozy Room',
    price: '5000',
    maximumCapacity: '2',
    gender: 'Any',
    isOccupied: false,
    description: 'A nice room',
    tags: ['wifi'],
    amenities: ['aircon'],
    buildingName: 'Building A',
    latitude: 14.6,
    longitude: 121.0,
    nearestCampus: 'Campus A',
    contacts: ['09171234567'],
    imageUrl: ['img.png'],
  };

  test('returns 422 when roomTitle is missing', async () => {
    const req = mockReq({ body: { ...validBody, roomTitle: '' } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({ roomTitle: expect.any(String) }),
      })
    );
    expect(Listing.create).not.toHaveBeenCalled();
  });

  test('returns 422 when roomTitle exceeds 120 characters', async () => {
    const req = mockReq({ body: { ...validBody, roomTitle: 'a'.repeat(121) } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('roomTitle');
  });

  test('returns 422 when price is not a valid number', async () => {
    const req = mockReq({ body: { ...validBody, price: 'abc' } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('price');
  });

  test('returns 422 when price is negative', async () => {
    const req = mockReq({ body: { ...validBody, price: '-100' } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('price');
  });

  test('returns 422 when description exceeds 3000 characters', async () => {
    const req = mockReq({ body: { ...validBody, description: 'x'.repeat(3001) } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('description');
  });

  test('returns 422 when maximumCapacity is not a valid number', async () => {
    const req = mockReq({ body: { ...validBody, maximumCapacity: 'two' } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('maximumCapacity');
  });

  test('returns 422 when maximumCapacity is less than 1', async () => {
    const req = mockReq({ body: { ...validBody, maximumCapacity: '0' } });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json.mock.calls[0][0].errors).toHaveProperty('maximumCapacity');
  });

  test('creates the listing and returns 201 when all fields are valid', async () => {
    const createdListing = { _id: VALID_ID, ...validBody, owner: 'user123' };
    Listing.create.mockResolvedValue(createdListing);

    const req = mockReq({ body: validBody });
    const res = mockRes();

    await listingController.createListing(req, res);

    expect(Listing.create).toHaveBeenCalledWith(
      expect.objectContaining({
        roomTitle: 'Cozy Room',
        price: 5000,
        maximumCapacity: 2,
        owner: 'user123',
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdListing);
  });
});

// ---------------------------------------------------------------------------
describe('returnListing', () => {
  test('returns 400 for an invalid listing id', async () => {
    const req = mockReq({ params: { id: INVALID_ID } });
    const res = mockRes();

    await listingController.returnListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when the listing does not exist', async () => {
    Listing.findById.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID } });
    const res = mockRes();

    await listingController.returnListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 200 with the listing when found', async () => {
    const fakeListing = { _id: VALID_ID, roomTitle: 'Room A' };
    Listing.findById.mockResolvedValue(fakeListing);

    const req = mockReq({ params: { id: VALID_ID } });
    const res = mockRes();

    await listingController.returnListing(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeListing);
  });
});

// ---------------------------------------------------------------------------
describe('updateListing', () => {
  test('returns 400 for an invalid listing id', async () => {
    const req = mockReq({ params: { id: INVALID_ID }, body: {} });
    const res = mockRes();

    await listingController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 403 when the listing does not exist', async () => {
    Listing.findById.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, body: {} });
    const res = mockRes();

    await listingController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('returns 200 and the updated listing on success', async () => {
    Listing.findById.mockResolvedValue({ _id: VALID_ID });
    const updatedListing = { _id: VALID_ID, roomTitle: 'Updated Room' };
    Listing.findByIdAndUpdate.mockResolvedValue(updatedListing);

    const req = mockReq({ params: { id: VALID_ID }, body: { roomTitle: 'Updated Room' } });
    const res = mockRes();

    await listingController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Listing updated', listing: updatedListing });
  });

  test('returns 400 when the update unexpectedly returns nothing', async () => {
    Listing.findById.mockResolvedValue({ _id: VALID_ID });
    Listing.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, body: { roomTitle: 'X' } });
    const res = mockRes();

    await listingController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ---------------------------------------------------------------------------
describe('deleteListing', () => {
  test('returns 400 for an invalid listing id', async () => {
    const req = mockReq({ params: { id: INVALID_ID } });
    const res = mockRes();

    await listingController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when the listing does not exist', async () => {
    Listing.findById.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID } });
    const res = mockRes();

    await listingController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 403 when the requester does not own the listing', async () => {
    Listing.findById.mockResolvedValue({ owner: OTHER_VALID_ID.toString() });

    const req = mockReq({ params: { id: VALID_ID }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('returns 200 when the listing is successfully deleted', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findByIdAndDelete.mockResolvedValue({ _id: VALID_ID });

    const req = mockReq({ params: { id: VALID_ID }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Listing is deleted' });
  });

  test('returns 500 when delete unexpectedly returns nothing', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findByIdAndDelete.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
describe('updateOccupancy', () => {
  test('returns 400 for an invalid listing id', async () => {
    const req = mockReq({ params: { id: INVALID_ID }, body: { isOccupied: true } });
    const res = mockRes();

    await listingController.updateOccupancy(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when the listing does not exist', async () => {
    Listing.findById.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, body: { isOccupied: true } });
    const res = mockRes();

    await listingController.updateOccupancy(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 403 when the requester does not own the listing', async () => {
    Listing.findById.mockResolvedValue({ owner: OTHER_VALID_ID.toString() });

    const req = mockReq({ params: { id: VALID_ID }, body: { isOccupied: true }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.updateOccupancy(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('returns 200 when occupancy is updated successfully', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findByIdAndUpdate.mockResolvedValue({ _id: VALID_ID, isOccupied: true });

    const req = mockReq({ params: { id: VALID_ID }, body: { isOccupied: true }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.updateOccupancy(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Occupied status changed' });
  });

  test('returns 500 when update unexpectedly returns nothing', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, body: { isOccupied: true }, user: { _id: 'user123' } });
    const res = mockRes();

    await listingController.updateOccupancy(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
describe('updateListingAssignment', () => {
  test('returns 400 for an invalid listing id', async () => {
    const req = mockReq({ params: { id: INVALID_ID }, body: { groupId: VALID_ID } });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when the listing does not exist', async () => {
    Listing.findById.mockResolvedValue(null);

    const req = mockReq({ params: { id: VALID_ID }, body: { groupId: VALID_ID } });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 403 when the requester does not own the listing', async () => {
    Listing.findById.mockResolvedValue({ owner: OTHER_VALID_ID.toString() });

    const req = mockReq({
      params: { id: VALID_ID },
      body: { groupId: VALID_ID },
      user: { _id: 'user123' },
    });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('clears the assignment (sets occupiedBy to null) when doClear is true', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findByIdAndUpdate.mockResolvedValue({ _id: VALID_ID, occupiedBy: null });

    const req = mockReq({
      params: { id: VALID_ID },
      body: { doClear: true },
      user: { _id: 'user123' },
    });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(Listing.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      { occupiedBy: null },
      { returnDocument: 'after' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('returns 400 when groupId is invalid', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });

    const req = mockReq({
      params: { id: VALID_ID },
      body: { groupId: INVALID_ID },
      user: { _id: 'user123' },
    });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 409 when the group is already assigned to another listing', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findOne.mockResolvedValue({ _id: OTHER_VALID_ID }); // conflicting assignment found

    const req = mockReq({
      params: { id: VALID_ID },
      body: { groupId: OTHER_VALID_ID },
      user: { _id: 'user123' },
    });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('returns 200 and assigns the group when everything is valid', async () => {
    Listing.findById.mockResolvedValue({ owner: 'user123' });
    Listing.findOne.mockResolvedValue(null); // no conflicting assignment
    Listing.findByIdAndUpdate.mockResolvedValue({ _id: VALID_ID, occupiedBy: OTHER_VALID_ID });

    const req = mockReq({
      params: { id: VALID_ID },
      body: { groupId: OTHER_VALID_ID },
      user: { _id: 'user123' },
    });
    const res = mockRes();

    await listingController.updateListingAssignment(req, res);

    expect(Listing.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      { occupiedBy: OTHER_VALID_ID },
      { returnDocument: 'after' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'occupiedBy successful.' });
  });
});
