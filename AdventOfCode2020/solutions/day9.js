// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            const response = await fetch('/inputs/day9.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            const text = await response.text();
            // Get all the non empty and valid numbers from the text
            const numberList = text.split('\n')
                .filter(Boolean)
                .map(Number);
            // Preamble defined as length 25
            const preambleLength = 25;
            const partOneResult = findInvalidNumber(numberList, preambleLength);
            const partTwoResult = deriveEncryptionWeakness(numberList, partOneResult);

            return {partOneResult, partTwoResult};
        }

        // Part 1: Find the first invalid number in the list
        function findInvalidNumber(numberList, preambleLength) {
            for (let i = preambleLength; i < numberList.length; i++) {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
                const preamble = numberList.slice(i - preambleLength, i);
                const target = numberList[i];
                if (!isTwoSum(preamble, target)) {
                    return target;
                }
            }
            throw new Error('invalid number not found');
        }

        // Reusing the logic from day 1, except here a hashset is enough
        function isTwoSum(preamble, target) {
            const valuesSeen = new Set();
            for (const value of preamble) {
                if (valuesSeen.has(target - value)) {
                    return true;
                }
                valuesSeen.add(value);
            }
            return false;
        }

        // Part 2: Find the encryption weakness
        function deriveEncryptionWeakness(numberList, target) {
            let start = 0;
            let end = 0;
            let currentSum = 0;

            while (end < numberList.length) {
                // Expand the window to the right
                currentSum += numberList[end];
                end++;

                // Shrink the window from the left if the sum exceeds the target
                while (currentSum > target && start < end) {
                    currentSum -= numberList[start];
                    start++;
                }

                // Check if the current sum matches the target
                if (currentSum === target) {
                    const numbersRange = numberList.slice(start, end);
                    const min = Math.min(...numbersRange);
                    const max = Math.max(...numbersRange);
                    return min + max;
                }
            }

            throw new Error('Encryption weakness not found');
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
        // console log error as well
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
