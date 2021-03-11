const fs = require('fs');
const request = require('request');
const readline = require('readline');

const stdin = process.stdin;
stdin.setEncoding('utf8');

const args = process.argv.slice(2, 4);
const url = args[0];
const filePath = args[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const overwrite = (body) => {
  rl.on('line', (answer) =>{
    if (answer === 'n') {
      process.exit();
    } else if (answer === 'y') {
      console.log(`Overwriting file at path ${filePath}`);
      writeFile(body);
      rl.close(); // must close readline listener
    } else {
      console.log('I do not understand, please enter \'y\' or \'n\'.');
    }
  })
};

const writeFile = (body) => { // writes body received from request() to file in filepath
  fs.writeFile(filePath, body, (err) => {
    if (err) throw err;
    console.log(`Downloaded and saved ${fs.statSync(filePath).size} bytes to ${filePath}`);
  });
};

// saves body of url into file specified in filePath (second clarg)
request(url, (error, response, body) => {
  if (error) { // if invalid url, stops execution
    console.log(`${error}: ${response}. Aborting exeuction`);
    process.exit();
  }

  fs.access(filePath, fs.R_OK, (err) => { //checks if file exists. 

    if (!err) { // if file exists (no error thrown)
      console.log('File already exists, overwrite? \'y\' or \'n\'');
      overwrite(body); // opens function to query user

    } else { // if file doesn't exist, we write it
      writeFile(body);
      rl.close() // must close readline listener
    }
  })
});