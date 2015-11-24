
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
       obj["Indicator Name"] = "GDP and GNI";
       obj["GDP_Per_Capita_2005"] = currentline[45];
       if(obj["GDP_Per_Capita_2005"] === "")
        obj["GDP_Per_Capita_2005"] = "0";
       result.push(obj);
    }

    if(currentline[2] === "GNI per capita (constant 2005 US$)"){
      var t;
      for(t=0;t<result.length;++t)
        if(currentline[1] === result[t]["Country Code"])
          result[t]["GNI_Per_Capita_2005"] = currentline[45];
    }
  }

  //Filter out continents and grouped countries
  var countries1 = [];

  function compare(a,b) {
    var gdp1 = parseFloat(a["GDP_Per_Capita_2005"]);
    var gdp2 = parseFloat(b["GDP_Per_Capita_2005"]);

    if (gdp1 > gdp2)
      return -1;
    if (gdp1 < gdp2)
     return 1;
    return 0;
  }


  function processSampleFile(inputFile) {
    readline = require('readline'),
    instream = fs.createReadStream(inputFile),
    outstream = new (require('stream'))(),
    rl = readline.createInterface(instream, outstream);
    rl.on('line', function (line) {
      var lines = line.split(",");
      if(lines[4].trim()!='Country 3') {
         countries1.push(lines[4].trim());
      }
    });

    rl.on('close', function (line) {
      var resultf = [];
      for(var i=0;i<result.length;++i){
         if(countries1.indexOf(result[i]["Country Code"]) > -1) {
          resultf.push(result[i]);
         }
      }

      resultf.sort(compare);

       var g15 = [];

      for(var i=0;i<15; ++i){
        var obj = {};
        obj["country"] = resultf[i]["Country Name"];
        var temp = parseFloat(resultf[i]["GDP_Per_Capita_2005"]);
        obj["growth1"] = parseInt(temp);
        temp = parseFloat(resultf[i]["GNI_Per_Capita_2005"]);
        obj["growth2"] = parseInt(temp);
        obj["growth3"] = 0;
        g15.push(obj);
      }
      console.log(JSON.stringify(g15,null,2));
  });
}

processSampleFile('countries.csv');

});
