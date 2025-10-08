'use strict';

export async function resolve(did) {

  const BASE_URL = "https://definitiveid.wsg127.com";
  
  try {
    const response = await fetch(`${BASE_URL}/definitiveid_services/rest/Public/Identity/${did}`, {
      headers: { 
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const didDocument = await response.json();
    return didDocument;

  } catch (err) {
    console.error("Resolution error:", err.message);
    return {
      error: "resolutionError",
      message: err.message || "Unexpected error occurred during DID resolution"
    };
  }
}
