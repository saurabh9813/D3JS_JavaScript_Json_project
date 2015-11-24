
var fs = require('fs');

fs.readFile('WDI_Data.csv', 'utf8', function(err, csv) {
  if(err) {
    return console.log(err);
  }

  var lines=csv.split("\r\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var k=1; k<lines.length-1; k++){
    var obj = {};
    var currentline=lines[k].split(",");

    //remove double qoutes
    var cl = currentline[2];
    if(cl[0] === "\""){
      var run = 3;
      while(true){
        if(currentline[run][currentline[run].length-1] === "\""){
          currentline[2] = currentline[2].substr(1,currentline[2].length) + ", " + currentline[run].substr(0,currentline[run].length-1);
          break;
        }
        currentline[2] = currentline[2].substr(1,currentline[2].length) + ", " + currentline[run];
        ++run;
      }

      run = run + 1;
      var i = 3;
      while(run<currentline.length) {
        currentline[i] = currentline[run];
        ++i;
        ++run;
      }
      currentline.length = headers.length;
    }

    if(currentline[2] === "GDP per capita (constant 2005 US$)"){
       obj["Country Name"] = currentline[0];
       obj["Country Code"] = currentline[1];
       obj["Indicator Name"] = "GDP Per Capita";

       for(var t=0; t<56; ++t){
        if(currentline[t+4] == "")
          obj[t] = 0.0;
        else
          obj[t] = parseFloat(currentline[t+4]);

      }
      result.push(obj);
    }

  }

//Filter out continents and grouped countries
var countries1 = {};

function processSampleFile(inputFile) {
  readline = require('readline'),
  instream = fs.createReadStream(inputFile),
  outstream = new (require('stream'))(),
  rl = readline.createInterface(instream, outstream);
  rl.on('line', function (line) {
      var lines =line.split(",");
      if(lines[4].trim()!='Country 3'){
         countries1[lines[4].trim()]=lines[6].trim();
      }
  });

  rl.on('close', function (line) {

  });

  rl.on('close', function (line) {
    var asia = [];
    var europe = [];
    var northAmerica = [];
    var southAmerica = [];
    var africa = [];
    var oceanic = [];

    for(var i=0;i<56;++i){
      asia[i] = 0.0;
      europe[i] = 0.0;
      northAmerica[i] = 0.0;
      southAmerica[i] = 0.0;
      africa[i] = 0.0;
      oceanic[i] = 0.0;
    }

    for(var i=0;i<result.length;++i){

      if(countries1[result[i]["Country Code"]] == "AS"){
        for(var j=0;j<56;++j){
          var t = j;
          var s = "" + t;
          asia[t] += result[i][s];
        }
      }

      else if(countries1[result[i]["Country Code"]] == "EU")
        for(var j=0;j<56;++j)
          europe[j] += result[i][j];

      else if(countries1[result[i]["Country Code"]] == "NA")
        for(var j=0;j<56;++j)
          northAmerica[j] += result[i][j];

      else if(countries1[result[i]["Country Code"]] == "SA")
        for(var j=0;j<56;++j)
          southAmerica[j] += result[i][j];

      else if(countries1[result[i]["Country Code"]] == "AF")
        for(var j=0;j<56;++j)
          africa[j] += result[i][j];


      else if(countries1[result[i]["Country Code"]] == "OC")
        for(var j=0;j<56;++j)
          oceanic[j] += result[i][j];

      else
        ;
    }

  //ASIA
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = asia[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('asia.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });

  //Europe
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = europe[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('europe.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });

//NorthAmerica
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = northAmerica[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('northAmerica.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });

//South America
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = southAmerica[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('southAmerica.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });


  //Oceanic
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = oceanic[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('oceanic.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });

  //Africa
  var items = [];
  for(var i=0;i<55; ++i){
    var obj = {};
    var j = i + 1960;
    var s = "" + j;
    obj["Year"] = s;
    var temp = africa[0 + i];
    obj["GDP"] = temp;
    items.push(obj);
  }

  fs.writeFile('africa.json',JSON.stringify(items,null,2),function(err) {
    if(err) {
      return console.log(err);
    }
  });
  });
}

processSampleFile('countries.csv');

});
