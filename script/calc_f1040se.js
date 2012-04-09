var util = require("util");
var fs = require("fs");

if(process.argv.length < 4){
	util.debug(
		"Invocation:\n" +
		"node SCRIPT INPUT.JSON\n" +
		"output is to stdout");
	process.exit(1);
}

var inputData = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

/* Calculate line 20 */
var totals = {
	"A" : 0,
	"B" : 0,
	"C" : 0
};

/* For 2011, line 3a is supposed to be 0. */
for(col in totals){
	var id = "L3a" + col;
	if(id in inputData)
		if(inputData[id])
			throw new Error("Line 3a is supposed to be 0!");

	/* Copy L3b to L4 */
	inputData["L4" + col] = inputData["L3b" + col];
}

for(var i = 5; i < 20; ++i){
	for(col in totals){
		var id = "L" + i + col;
		if(id in inputData)
			totals[col] += inputData[id];
	}
}

for(col in totals){
	/* If no expenses or income skip it. */
	if(!totals[col] && !inputData["L4" + col])
		continue;

	inputData["L20" + col] = totals[col];
	inputData["L21" + col] = inputData["L4" + col] - totals[col];

	/* FIXME check Form 6198 results! */
	/* FIXME check Form 8582 for limitations! */
	inputData["L22" + col] = inputData["L21" + col];
}

/* According to form, these would be 0 since 3a is 0. */
inputData["L23a"] = 0;
inputData["L23b"] = 0;

/*  */
inputData["L23c"] = 
	(("L4A" in inputData) ? inputData["L4A"] : 0) +
	(("L4B" in inputData) ? inputData["L4B"] : 0) +
	(("L4C" in inputData) ? inputData["L4C"] : 0);

inputData["L23e"] = 
	(("L12A" in inputData) ? inputData["L12A"] : 0) +
	(("L12B" in inputData) ? inputData["L12B"] : 0) +
	(("L12C" in inputData) ? inputData["L12C"] : 0);

inputData["L23f"] = 
	(("L18A" in inputData) ? inputData["L18A"] : 0) +
	(("L18B" in inputData) ? inputData["L18B"] : 0) +
	(("L18C" in inputData) ? inputData["L18C"] : 0);

inputData["L23g"] = inputData["L20A"] + inputData["L20B"] + inputData["L20C"];

inputData["L24"] = 0;
for(col in totals){
	var id = "L21" + col;
	if((id in inputData) && inputData[id] > 0)
		inputData["L24"] += inputData[id];
}

/*  */
inputData["L25"] = 0;
for(col in totals){
	var id = "L22" + col;
	if((id in inputData) && inputData[id] > 0)
		inputData["L25"] += inputData[id];
}

inputData["L26"] = inputData["L24"] + inputData["L25"];

/* Output augmented data to stdout. */
util.puts(JSON.stringify(inputData));
