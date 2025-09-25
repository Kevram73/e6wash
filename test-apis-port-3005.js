#!/usr/bin/env node

// Test rapide des APIs sur le port 3005
const http = require('http');

const testAPI = (endpoint) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: endpoint,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ 
            endpoint, 
            status: res.statusCode, 
            success: res.statusCode === 200,
            hasData: json.agencies || json.orders || json.customers || json.services || json.tasks || json.inventory || json.notifications || json.promotions || json.loyalty || json.subscriptions || json.tenants || json.users || json.countries || json.suppliers || json.billing || json.reports || json.messages || json.conversations || json.data,
            error: json.error || null
          });
        } catch (error) {
          resolve({ 
            endpoint, 
            status: res.statusCode, 
            success: false,
            hasData: false,
            error: 'Invalid JSON',
            raw: data.substring(0, 100)
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({ endpoint, error: error.message });
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ endpoint, status: 408, success: false, hasData: false, error: 'Timeout' });
    });
    
    req.end();
  });
};

async function testAPIs() {
  console.log('🧪 Test des APIs sur le port 3005\n');
  
  const endpoints = [
    '/api/agencies',
    '/api/orders',
    '/api/customers',
    '/api/services',
    '/api/tasks',
    '/api/inventory',
    '/api/notifications',
    '/api/promotions',
    '/api/loyalty',
    '/api/subscriptions',
    '/api/tenants',
    '/api/users',
    '/api/countries',
    '/api/suppliers',
    '/api/billing',
    '/api/reports',
    '/api/messages',
    '/api/conversations',
    '/api/dashboard/stats?role=ADMIN'
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const result = await testAPI(endpoint);
      results.push(result);
      
      const status = result.success ? '✅' : '❌';
      const data = result.hasData ? '📊' : '📭';
      console.log(`${status} ${data} ${endpoint} - Status: ${result.status}${result.error ? ` - Error: ${result.error}` : ''}`);
      
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.error}`);
      results.push({ endpoint, success: false, error: error.error });
    }
  }
  
  console.log('\n📊 Résumé:');
  const successful = results.filter(r => r.success && r.hasData);
  const failed = results.filter(r => !r.success);
  const noData = results.filter(r => r.success && !r.hasData);
  
  console.log(`✅ APIs fonctionnelles avec données: ${successful.length}`);
  console.log(`❌ APIs en erreur: ${failed.length}`);
  console.log(`📭 APIs sans données: ${noData.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ APIs fonctionnelles:');
    successful.forEach(r => console.log(`   - ${r.endpoint}`));
  }
}

testAPIs().catch(console.error);
