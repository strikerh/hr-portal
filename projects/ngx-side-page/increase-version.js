const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'package.json');

// Read the package.json file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading package.json:', err);
        return;
    }

    // Parse the JSON data
    const packageJson = JSON.parse(data);

    // Split the version into parts
    const versionParts = packageJson.version.split('.').map(Number);

    // Increment the patch version
    versionParts[2] += 1;

    // Join the version parts back into a string
    packageJson.version = versionParts.join('.');

    // Write the updated package.json back to the file
    fs.writeFile(filePath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing package.json:', err);
            return;
        }
        console.log('Version updated to', packageJson.version);
    });
});
