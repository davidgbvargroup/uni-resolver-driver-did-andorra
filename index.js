'use strict';

import express from 'express';
import { resolve } from './service/DefaultService.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    method: 'did:andorra',
    version: '1.0.1'
  });
});

// Universal Resolver standard endpoint
app.get('/1.0/identifiers/:did(*)', async (req, res) => {
  try {
    const did = req.params.did;
    
    console.log(`[RESOLVE] Attempting to resolve: ${did}`);
    
    // Validate DID format
    if (!did.startsWith('did:andorra:')) {
      console.error(`[ERROR] Invalid DID format: ${did}`);
      return res.status(400).json({
        error: 'invalidDid',
        message: 'DID must start with did:andorra:'
      });
    }

    // Validate DID syntax against NRTAD pattern
    const nrtadPattern = /^did:andorra:NRTAD-[0-9]{6}[A-Z](?:_(ISS|SP))?$/;
    if (!nrtadPattern.test(did)) {
      console.error(`[ERROR] DID does not match NRTAD pattern: ${did}`);
      return res.status(400).json({
        error: 'invalidDid',
        message: 'DID must match pattern: did:andorra:NRTAD-######X[_ISS|_SP]'
      });
    }

    // Resolve the DID
    const result = await resolve(did);
    
    if (result.error) {
      console.error(`[ERROR] Resolution failed: ${result.error} - ${result.message}`);
      
      const statusCode = result.error === 'notFound' ? 404 : 500;
      return res.status(statusCode).json({
        error: result.error,
        message: result.message
      });
    }

    console.log(`[SUCCESS] Resolved DID: ${did}`);
    
    // Return only the DID Document
    res.setHeader('Content-Type', 'application/did+ld+json');
    res.json(result);

  } catch (error) {
    console.error('[FATAL] Unexpected error during resolution:', error);
    res.status(500).json({
      error: 'internalError',
      message: error.message || 'Unexpected error occurred'
    });
  }
});

// Catch-all for unsupported endpoints
app.use((req, res) => {
  res.status(404).json({
    error: 'notFound',
    message: 'Endpoint not found. Use /1.0/identifiers/{did} to resolve a DID.'
  });
});

app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════╗`);
  console.log(`║  Universal Resolver Driver: did:andorra   ║`);
  console.log(`╠════════════════════════════════════════════╣`);
  console.log(`║  Port: ${PORT.toString().padEnd(37)}║`);
  console.log(`║  Status: Running                           ║`);
  console.log(`╚════════════════════════════════════════════╝`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[SHUTDOWN] SIGINT received, shutting down gracefully...');
  process.exit(0);
});