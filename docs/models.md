# Models

| Model | Description |
| :--- | :--- |
| Users | User accounts for API access
| Cats | Fluffy **pettable** cats!
| Shelters | Shelters that house our lovable cats

## Model Attributes

### User Model
| Attribute | Type | Description |
| :--- | :--- | :--- |
| _id | Integer | Idenitfying attibute for each user
| username | String | Unique username for each user
| email | String | Unique contact email for each user
| password | String | User's password, used for login

### Cat Model
| Attribute | Type | Description |
| :--- | :--- | :--- |
| _id | Integer | Idenitfying attibute for each cat
| name | String | Name of the cat
| breed | String | Breed of the cat
| age | Number | age of the cat
| description | String | A thoughtful description for the cat
| pictureUrl | String | A url of an image representing the cat
| fact | String | An associated fact loosely associated with cats in general
| loveMeter | Number | A representation of the cat's current happiness score
| favouriteThing | String | This cat's favourite thing: food, pets or playtime!
| shelter | ObjectId | _id of the shelter where the cat is being housed 

### Shelter Model
| Attribute | Type | Description |
| :--- | :--- | :--- |
| _id | Integer | Idenitfying attibute for each shelter
| name | String | Name of the shelter
| country | String | Country where the shelter is located
| state | String | State/Province where the shelter is located
| phone | String | Phone contact for the shelter
| email | String | Email contact for the shelter
| cats | Array | A list of cats being housed in this shelter
