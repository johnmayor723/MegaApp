const axios = require('axios');
const domain = 'adedoyinbeaconofhopefoundation.com.ng'; // Replace with the domain you want to check

async function checkNgDomain(domain) {
  try {
    const res = await axios.get(
      `https://rdap.nic.net.ng/domain/${domain}`,
      {
        headers: {
          Accept: 'application/rdap+json',
          'User-Agent': 'KeemaDomainChecker/1.0'
        },
        timeout: 10000
      }
    );

    // If we get here, status is 200 → domain EXISTS
    console.log('❌ Domain is NOT available');
    return {
      domain,
      available: false,
      source: 'rdap'
    };

  } catch (err) {
    const status = err.response?.status;

    if (status === 404 || status === 500) {
      // NiRA behavior: domain does not exist
      console.log('✅ Domain is AVAILABLE');
      return {
        domain,
        available: true,
        source: 'rdap'
      };
    }

    // Real network / timeout / unknown error
    console.error('⚠️ RDAP error:', err.message);
    return {
      domain,
      available: null,
      error: 'RDAP_UNREACHABLE'
    };
  }
}

(async () => {
  const result = await checkNgDomain(domain);
  console.log('RESULT:', result);
})();
