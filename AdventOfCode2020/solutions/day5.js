// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day5.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            //get non empty lines
            const seatCodes = text.split('\n').filter(Boolean);

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = findHighestSeatId(seatCodes);
            const partTwoResult = findMissingSeatId(seatCodes);

            return {partOneResult, partTwoResult};
        }

        // Function to decode a seat code into its seat ID
        function decodeSeatId(seatCode) {
            // Replace F/L with 0 and B/R with 1 to treat the code as a binary string
            // Using regex to do a replace on both substrings
            const binaryCode = seatCode.replace(/F|L/g, '0').replace(/B|R/g, '1');
            // Convert binary string to decimal as it is coming from binary format
            return parseInt(binaryCode, 2);
        }

        // Function to find the highest seat ID (Part 1)
        function findHighestSeatId(seatCodes) {
            // Decode all seat IDs and find the maximum
            //... spreads the array into individual arguments for max after the map is applied
            return Math.max(...seatCodes.map(decodeSeatId));
        }

        // Function to find the missing seat ID (Part 2)
        function findMissingSeatId(seatCodes) {
            // Decode and sort by ascending seat IDs
            const seatIds = seatCodes.map(decodeSeatId).sort((a, b) => a - b);
            for (let i = 1; i < seatIds.length; i++) {
                // Check for a gap between consecutive seat IDs
                if (seatIds[i] - seatIds[i - 1] > 1) {
                    // The missing seat ID is in the gap
                    return seatIds[i] - 1;
                }
            }
            return null;
        }

        // Call the fetch and process function and get results
        const {partOneResult, partTwoResult} = await fetchAndProcessInput();

        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        document.getElementById('solution-output-part1').textContent = `Part 1 Solution: ${partOneResult}`;
        document.getElementById('solution-output-part2').textContent = `Part 2 Solution: ${partTwoResult}`;
    } catch (error) {
        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        // Log to console as an error
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
