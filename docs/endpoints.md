# Endpoints

## Cat Queries:

### GET Requests:
- GET /cats => Returns a list of all cats
- GET /cats/:catId => Returns a single cat, searchable by id.

### POST Requests:
- POST /cats => Creates a new cat entry in the database.  Required parameters: 'name', 'breed', 'age' and 'description'.  If a shelter is not entered, one will be randomly assigned.  A picture and fact will be assigned to your cat at the time of creation.

### PATCH Requests:
- PATCH /cats/:catId => Allows for modification of 'name', 'breed', 'age', or 'description' for an existing cat.  No other parameters can be directly edited.

### PUT Requests:
- PUT /:catId/pet => YOU CAN PET THE CAT! Petting a cat will increase its happiness score based on its specific affinities!
- PUT /:catId/play => Playing with a cat will increase its happiness score based on its specific affinities!
- PUT /:catId/treats => Giving treats to a cat will increase its happiness score based on its specific affinities!

Try petting/playing with/feeding your favourite cat and watch its happiness score grow!

### DELETE Requests:
!> **WARNING**: Destructive action!
- DELETE /:catId => Removes a cat from the system.

## Shelter Queries:

### GET Requests:
- GET /shelters => Returns a list of all shelters
- GET /shelters/:helterId => Returns a single shelter, searchable by id.

### POST Requests:
- POST /shelters => Creates a new shelter entry in the database.  Required parameters: 'name', 'country', 'state', 'phone', or 'email'.

### PUT Requests:
- PUT /shelters/:shelterId => Allows for modification of 'name', 'country', 'state', 'phone', or 'email' for an existing shelter.

### DELETE Requests:
!> **WARNING**: Destructive action!
- DELETE /:shelterId => Removes a shelter from the system.  