function arrToSpacedString(arr) {
    return arr.join(" ");
}

var firstFoundWord = "";
//recursively traverse the node list searching for nodes
function findWords(node, matchRegExp) {
    var skipTags = new RegExp("^(?:SCRIPT|FORM|SPAN)$");

    if (node === undefined || !node) return;
    if (!matchRegExp) return;
    if (skipTags.test(node.nodeName)) return;

    if (node.hasChildNodes()) {
        for (var i = 0; i < node.childNodes.length; i++)
            findWords(node.childNodes[i], matchRegExp);
    }
    if (node.nodeType == 3) {
        // NODE_TEXT
        var nv, regs;

        if ((nv = node.nodeValue) && (regs = matchRegExp.exec(nv))) {
            //find a match? then set the found word
            if (regs.length > 0) {
                firstFoundWord = regs[0];
                return;
            }
        }
    }
}

function highlightArray(arr, color, hilitor, text, inputName, inputValue) {
    //do the highlighting
    hilitor.apply(arrToSpacedString(arr), color);

    var found = false;

    //prep for regex
    var matchRegExp = "";
    text = text.replace(Hilitor.endRegExp, "");
    text = text.replace(Hilitor.breakRegExp, "|");
    text = text.replace(/^\||\|$/g, "");

    var sourceDiv = document.getElementById("source");

    arr.forEach(function (item) {
        //set the regex
        var re = "(" + item + ")";
        //these make sure the regex is closed on both sides so selects whole word
        re = "\\b" + re;
        re = re + "\\b";
        matchRegExp = new RegExp(re, "i");

        //traverse the node tree
        findWords(sourceDiv, matchRegExp);

        if (firstFoundWord) {
            console.log("found", firstFoundWord);
            found = true;
            firstFoundWord = "";

            return;
        }
    });

    //found something, activate the checkbox and highlight the text
    if (found) {
        $(`input[name='${inputName}'][value='${inputValue}']`).prop(
            "checked",
            true
        );
        $(`label:contains("${inputValue}")`).css("background-color", color);
    }
}

function filter() {
    var text = $("#source").text();

    //get rid of the Text:
    text = text.substring(5, text.length);
    text.toLowerCase();

    //attach the hilitor to #source html element
    var hilitor = new Hilitor("source");

    //now highlight all the arrays
    //the main sub-categories
    highlightArray(
        selfHarmAndSuicideKeywords,
        "Aqua",
        hilitor,
        text,
        "subCategory",
        "self-harm/suicidal"
    );
    highlightArray(
        anxietyAndDepressionKeywords,
        "Violet",
        hilitor,
        text,
        "subCategory",
        "anxiety/depression"
    );

    //FUTURE KYLE: get colors and input/value for violence, sexual explicit
    highlightArray(hateAndRacismKeywords, "Red Dirt", hilitor, text, "subCategory", "hate/racism")
    highlightArray(violenceKeywords, "", hilitor, text, "subCategory", "")
    highlightArray(sexualExplicitKeyword, "", hilitor, text, "subCategory", "")

    //genders
    highlightArray(maleKeywords, "red", hilitor, text, "gender", "male");
    highlightArray(femaleKeywords, "blue", hilitor, text, "gender", "female");
    highlightArray(transgenderKeywords, "Mocha", hilitor, text, "gender", "transgender")

    //sexual orientation
    highlightArray(
        heteroSexualKeywords,
        "brown",
        hilitor,
        text,
        "sexOrient",
        "heterosexual"
    );
    highlightArray(homosexualKeywords, "Dark Forest Green", hilitor, text, "sexOrient", "homosexual_gay_or_lesbian")

    //then the races
    highlightArray(blackKeywords, "yellow", hilitor, text, "race", "black");
    highlightArray(whiteKeywords, "Chartreuse", hilitor, text, "race", "white");
    highlightArray(asianKeywords, "GoldenRod", hilitor, text, "race", "asian");
    highlightArray(latinoKeywords, "purple", hilitor, text, "race", "latino");
    highlightArray(indianKeywords, "orange", hilitor, text, "race", "indian");
    highlightArray(arabsKeywords, "green", hilitor, text, "race", "arabs");

    //now religion
    highlightArray(
        buddhistKeywords,
        "PaleTurquoise",
        hilitor,
        text,
        "religion",
        "buddhist"
    );
    highlightArray(
        christianKeywords,
        "Tan",
        hilitor,
        text,
        "religion",
        "christian"
    );
    highlightArray(hinduKeywords, "Violet", hilitor, text, "religion", "hindu");
    highlightArray(
        muslimKeywords,
        "Thistle",
        hilitor,
        text,
        "religion",
        "muslim"
    );
    highlightArray(
        jewishKeywords,
        "YellowGreen",
        hilitor,
        text,
        "religion",
        "jewish"
    );
    highlightArray(
        atheistKeywords,
        "Turquoise",
        hilitor,
        text,
        "religion",
        "atheist"
    );
    highlightArray(
        nonReligiousKeywords,
        "RosyBrown",
        hilitor,
        text,
        "religion",
        "nonreligious"
    );

    //disabilities
    highlightArray(
        disabilityKeywords,
        "MidnightBlue",
        hilitor,
        text,
        "disability",
        "disability"
    );

    //other
    highlightArray(
        indigenousKeywords,
        "HotPink",
        hilitor,
        text,
        "other",
        "indigenous"
    );
    highlightArray(
        refugeeAndImmigrantKeywords,
        "Gold",
        hilitor,
        text,
        "other",
        "refugee/immigrant"
    );
}

//append button to do the work for us
var button = document.createElement("button");
button.innerHTML = "auto label";
button.onclick = filter;
document.body.append(button);

var div = document.createElement("div");
div.innerHTML =
    "This button will label as much as it can from general pronouns and stuff but it won't get everything. Use with caution!!";
document.body.append(div);
