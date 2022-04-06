### Integration

Titles and links in the prominent teaser are used likewise to the other teaser components and simple links that redirect over href

## Attributes to be configured for asynchronous request

- data-api-url="{{apiUrl}}"
  - Request for all jobs example: https://live.solique.ch/KTZH/de/api/v1/data/
- data-base-url="{{baseUrl}}"
  - Base URL for redirecting links example: https://live.solique.ch/KTZH/de/
- data-filters="{{filters}}"
  - Filter for job properties example: `office.id=KTZH_Office;organization.id=ORG20` every property and sub property have to be selected using dot notation object.subobject1.subobject2 after that "=" denotes the filter value that is search for in every job object. Chaining multiple properties for filtering (AND connected) they must be sparated be ";"

