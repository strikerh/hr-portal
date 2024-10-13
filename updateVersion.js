const fs = require('fs');
const path = require('path');

// Path to the environment.ts file
const envFilePath = path.join(__dirname, 'src/environments/environment.ts');

// Read the environment.ts file
fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Extract the version number
    const versionRegex = /version:\s*'(\d+\.\d+\.\d+)'/;
    const match = data.match(versionRegex);

    if (!match) {
        console.error('Version number not found in the file.');
        return;
    }

    // Increment the version number
    const versionParts = match[1].split('.').map(Number);
    versionParts[2] += 1; // Increment the patch version
    const newVersion = versionParts.join('.');

    // Replace the old version with the new version
    const updatedData = data.replace(versionRegex, `version: '${newVersion}'`);

    // Write the updated content back to the environment.ts file
    fs.writeFile(envFilePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }
        console.log('Version updated to:', newVersion);
    });
});
