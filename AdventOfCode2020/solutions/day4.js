/*
Proper promise handling and Errors are caught and logged predictably
For this day, I used these links as a reference:
https://0xdf.gitlab.io/adventofcode2020/4
https://www.globalnerdy.com/2020/12/06/my-solution-to-advent-of-code-2020s-day-4-challenge-in-python/#google_vignette
*/
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day4.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            /*
            Each passport is separated by a blank line
            Convert passport into an object of key-value pair
            For example:
            {
            "eyr": "2024",
            "pid": "662406624",
            "hcl": "#cfa07d",
            "byr": "1947",
            "iyr": "2015",
            "ecl": "amb",
            "hgt": "150cm"
            }
             */
            const passports = text.split('\n\n')
                .map(passport => {
                    /*
                     Returns an object created by key-value entries for properties and methods
                     @param entries An iterable object that contains key-value entries for properties and methods.
                     */
                    return Object.fromEntries(
                        ///\s+/ matches one or more whitespace characters (spaces, tabs, or newlines)
                        passport.split(/\s+/).map(field => field.split(':'))
                    );
                });

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = countValidPassportsPartOne(passports);
            const partTwoResult = countValidPassportsPartTwo(passports);

            return {partOneResult, partTwoResult};
        }

        // Function to count passports with all required fields (Part 1)
        function countValidPassportsPartOne(passports) {
            const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
            return passports.filter(passport =>
                // Return iff all fields match, similar to allMatch in Java
                requiredFields.every(field => field in passport)
            ).length;
        }

        // Function to count passports with valid field values (Part 2)
        function countValidPassportsPartTwo(passports) {
            // Validation rules for each required field
            const requiredFields = {
                // Birth year: 4 digits between 1920 and 2002
                byr: value => value.length === 4 && value >= "1920" && value <= "2002",

                // Issue year: 4 digits between 2010 and 2020
                iyr: value => value.length === 4 && value >= "2010" && value <= "2020",

                // Expiration year: 4 digits between 2020 and 2030
                eyr: value => value.length === 4 && value >= "2020" && value <= "2030",

                // Height: "cm" between 150-193 or "in" between 59-76
                // check height in cn or in
                hgt: value => {
                    if (value.endsWith("cm")) {
                        const height = parseInt(value, 10);
                        return height >= 150 && height <= 193;
                    }
                    if (value.endsWith("in")) {
                        const height = parseInt(value, 10);
                        return height >= 59 && height <= 76;
                    }
                    return false;
                },

                // Hair color: Must start with # and have exactly 6 valid hex characters
                // [...] converts the remaining characters into an array of individual characters (spread)
                hcl: value => value.startsWith("#") && value.length === 7 && [...value.slice(1)].every(char => "0123456789abcdef".includes(char)),

                // Eye color: Must be one of the specified valid colors
                ecl: value => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value),

                // Passport ID: Must be a 9-digit number
                pid: value => value.length === 9 && !isNaN(value)
            };

            // Filter passports where all required fields are valid
            return passports.filter(passport =>
                // Check if every required field exists and passes its validator function
                Object.entries(requiredFields).every(([field, validator]) =>
                    field in passport && validator(passport[field])
                )
            ).length;
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
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
