
const { Util } = require("../config/import.util");
const { axios } = require("../config/module.import");

const apiUrl = 'https://aurelia.portaltobitcoin.com/api/v2/stats';
const globalState = {}; // Initialize globalState

// Function to repeatedly fetch data
async function fetchGasPrices() {
    while (true) {
        try {
            await Util.sleep(5000); // Ensure delay before each request

            const { data } = await axios.get(apiUrl);

            // Update globalState safely
            globalState.swap = data?.gas_prices?.average <= 100 || false;

            console.log('average_gas', data?.gas_prices?.average);
        } catch (error) {
            console.error('Error fetching gas prices:', error.message);

            // Optionally break the loop if error persists
            // break; // Uncomment to stop loop on error
        }
    }
}

// Start the function
fetchGasPrices().catch(error => console.error('Fatal error:', error.message));
