//command to run whole project tsc --init
//that command throws us a tsconfig.json file
//the indicator that the this whole project should be managed by typescript

//then we run 'tsc' without pointing to any file
// then run tsc -w to watch all files on save

let logged;

function sendAnalytics(data: string) {
  console.log(data);
  logged = true;
}

sendAnalytics("The DATA");
