'use strict';

const BASE_URL = process.env.BASE_URL || "https://definitiveid.wsg127.com";

export async function resolve(did) {
  try {
    const response = await fetch(`${BASE_URL}/definitiveid_services/rest/Public/Identity/${did}`, {
      headers: { "Accept": "application/json" }
    });

    if (response.status === 404) {
      return { error: "notFound", message: `DID not found: ${did}` };
    }

    if (!response.ok) {
      return { error: "resolutionError", message: `API returned status ${response.status}` };
    }

    const didDocument = await response.json();
    
    if (!didDocument || !didDocument.id) {
      return { error: "invalidDidDocument", message: "Invalid DID Document from registry" };
    }

    return didDocument;

  } catch (err) {
    console.error("Resolution error:", err.message);
    return {
      error: "resolutionError",
      message: err.message || "Unexpected error occurred"
    };
  }
}