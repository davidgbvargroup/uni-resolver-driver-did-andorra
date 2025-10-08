# Universal Resolver Driver: did:andorra

This is a [Universal Resolver](https://github.com/decentralized-identity/universal-resolver/) driver for **did:andorra** identifiers.

## Specifications

- [Decentralized Identifiers](https://www.w3.org/TR/did-core/)
- [DID Method Specification](https://github.com/davidgbvargroup/did-andorra-method-spec/blob/main/spec.md)

## Example DIDs

```
did:andorra:NRTAD-710646J
did:andorra:NRTAD-059888N_ISS
did:andorra:NRTAD-059888N_SP
```

## Build and Run (Docker)

```bash
docker build -f ./docker/Dockerfile . -t universalresolver/driver-did-andorra
docker run -p 8080:8080 universalresolver/driver-did-andorra
curl -X GET http://localhost:8080/1.0/identifiers/did:andorra:NRTAD-059888N_SP
```

## Build (native)

```bash
npm install
npm start
```

## Driver Environment Variables

The driver recognizes the following environment variables:

### `PORT`

- **Description**: HTTP port for the driver service
- **Default value**: `8080`

### `BASE_URL`

- **Description**: Base URL of the DefinitiveID API endpoint
- **Default value**: `https://definitiveid.wsg127.com`

## Driver Metadata

The driver returns the following metadata in addition to a DID document:

### Resolution Metadata

- **contentType**: `application/did+ld+json`
- **pattern**: DID must match `^did:andorra:NRTAD-[0-9]{6}[A-Z](?:_(ISS|SP))?$`

## Method-Specific Information

The `did:andorra` method is a **read-only** DID method that wraps the official identifiers from the **Andorra National Registry of Legal Entities (NRTAD)**. 

### Key Characteristics:

- **Authority**: Government of Andorra
- **Registry**: NRTAD (Número de Registre Tributari d'Andorra)
- **Resolution**: Read-only via DefinitiveID infrastructure
- **Governance**: OSCEPA (Oficina de Servicios de Certificación y Protección Andorrana)

### DID Syntax

```
did:andorra:<nrtad-identifier>
```

Where `<nrtad-identifier>` follows the pattern:
- Base format: `NRTAD-######X` (6 digits + 1 uppercase letter)
- Optional suffixes:
  - `_ISS` - Entity acts as Issuer of verifiable credentials
  - `_SP` - Entity acts as Service Provider

### Resolution Endpoint

The driver connects to:
```
GET https://definitiveid.wsg127.com/definitiveid_services/rest/Public/Identity/{did}
```

## Architecture

```
Universal Resolver → Driver (Node.js) → DefinitiveID API → DID Document
```

### Components

- **index.js**: Express server handling HTTP resolution requests
- **defaultservice.js**: Core resolution logic connecting to DefinitiveID API
- **Dockerfile**: Container configuration for deployment

## Response Format

### Successful Resolution

```json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": "did:andorra:NRTAD-059888N_SP",
    "verificationMethod": [{
      "id": "did:andorra:NRTAD-059888N_SP#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:andorra:NRTAD-059888N_SP",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "...",
        "y": "..."
      }
    }],
    "assertionMethod": [
      "did:andorra:NRTAD-059888N_SP#key-1"
    ],
    "service": [{
      "id": "did:andorra:NRTAD-059888N_SP#service-1",
      "type": "DIDResolutionService",
      "serviceEndpoint": "https://definitiveid.wsg127.com"
    }]
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  },
  "didDocumentMetadata": {}
}
```

### Error Responses

```json
{
  "error": "notFound",
  "message": "DID not found in registry"
}
```

```json
{
  "error": "invalidDid",
  "message": "DID must start with did:andorra:"
}
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Testing

```bash
# Start the driver
docker-compose up

# Test resolution of example DIDs
curl -X GET http://localhost:8080/1.0/identifiers/did:andorra:NRTAD-710646J
curl -X GET http://localhost:8080/1.0/identifiers/did:andorra:NRTAD-059888N_ISS
curl -X GET http://localhost:8080/1.0/identifiers/did:andorra:NRTAD-059888N_SP
```

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass before submitting PR
2. Docker image builds successfully
3. Driver resolves all example DIDs
4. Documentation is updated accordingly

## Contact

**Maintainer**: David Garcia Beatove  
**Email**: david.garciab@vargroupiberia.com  
**Organization**: VarGroup Iberia (on behalf of Government of Andorra)

## License

Apache License 2.0

## Additional Resources

- [W3C DID Core Specification](https://www.w3.org/TR/did-core/)
- [W3C DID Resolution Specification](https://www.w3.org/TR/did-resolution/)
- [Universal Resolver](https://github.com/decentralized-identity/universal-resolver)
- [did:andorra Method Specification](https://github.com/davidgbvargroup/did-andorra-method-spec/blob/main/spec.md)
- [W3C DID Specification Registries](https://www.w3.org/TR/did-spec-registries/)