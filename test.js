'use strict';

import { resolve } from './service/DefaultService.js';

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

async function runTests() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Testing did:andorra Universal Resolver   ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const tests = [
    {
      name: 'Valid DID - Base format',
      did: 'did:andorra:NRTAD-710646J',
      shouldSucceed: true
    },
    {
      name: 'Valid DID - Issuer suffix',
      did: 'did:andorra:NRTAD-059888N_ISS',
      shouldSucceed: true
    },
    {
      name: 'Valid DID - Service Provider suffix',
      did: 'did:andorra:NRTAD-059888N_SP',
      shouldSucceed: true
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n📋 Test: ${test.name}`);
    console.log(`   DID: ${test.did}`);
    
    try {
      const result = await resolve(test.did);
      
      if (result.error) {
        if (test.shouldSucceed) {
          console.log(`   ${COLORS.red}✗ FAILED${COLORS.reset}`);
          console.log(`   Error: ${result.error} - ${result.message}`);
          failed++;
        } else {
          console.log(`   ${COLORS.green}✓ PASSED${COLORS.reset} (expected failure)`);
          passed++;
        }
      } else {
        if (test.shouldSucceed) {
          console.log(`   ${COLORS.green}✓ PASSED${COLORS.reset}`);
          console.log(`   Resolved ID: ${result.id}`);
          console.log("DID Document");
          console.log(JSON.stringify(result, null, 2));
          passed++;
        } else {
          console.log(`   ${COLORS.red}✗ FAILED${COLORS.reset} (unexpected success)`);
          failed++;
        }
      }
    } catch (err) {
      console.log(`   ${COLORS.red}✗ FAILED${COLORS.reset}`);
      console.log(`   Exception: ${err.message}`);
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log(`║  Test Results                              ║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  ${COLORS.green}Passed: ${passed}${COLORS.reset}                                ║`);
  console.log(`║  ${failed > 0 ? COLORS.red : ''}Failed: ${failed}${COLORS.reset}                                ║`);
  console.log(`║  Total:  ${passed + failed}                                ║`);
  console.log('╚════════════════════════════════════════════╝\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});