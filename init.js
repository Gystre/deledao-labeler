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
        "#CC6600", //mid red
        hilitor,
        text,
        "subCategory",
        "self-harm/suicidal"
    );
    highlightArray(
        anxietyAndDepressionKeywords,
        "#aaaaaa", //mid gray
        hilitor,
        text,
        "subCategory",
        "anxiety/depression"
    );

    highlightArray(
        hateAndRacismKeywords,
        "#ffcc99", //light orange
        hilitor,
        text,
        "subCategory",
        "hate/racism"
    );
    highlightArray(
        violenceKeywords,
        "DarkOrange",
        hilitor,
        text,
        "subCategory",
        "violence"
    );
    highlightArray(
        cyberbullyAndHarassmentKeywords,
        "#b33c00", //light brown
        hilitor,
        text,
        "subCategory",
        "cyberbully/harassment"
    );
    highlightArray(
        sexualExplicitKeywords,
        "#4d4d4d", //dark pink
        hilitor,
        text,
        "subCategory",
        "sexual_explicit"
    );

    //genders
    highlightArray(maleKeywords, "red", hilitor, text, "gender", "male");
    highlightArray(femaleKeywords, "blue", hilitor, text, "gender", "female");
    highlightArray(
        transgenderKeywords,
        "#ffe0b3", //light orange
        hilitor,
        text,
        "gender",
        "transgender"
    );

    //sexual orientation
    highlightArray(
        heteroSexualKeywords,
        "brown",
        hilitor,
        text,
        "sexOrient",
        "heterosexual"
    );
    highlightArray(
        homosexualKeywords,
        "#ffb3b3", //light pink
        hilitor,
        text,
        "sexOrient",
        "homosexual_gay_or_lesbian"
    );

    //then the races
    highlightArray(blackKeywords, "#b36b00", hilitor, text, "race", "black"); //dark orange
    highlightArray(whiteKeywords, "#4d3900", hilitor, text, "race", "white"); //dark yellow
    highlightArray(asianKeywords, "#996633", hilitor, text, "race", "asian"); //mid brown
    highlightArray(latinoKeywords, "#990000", hilitor, text, "race", "latino"); //crimson red
    highlightArray(indianKeywords, "#1a1300", hilitor, text, "race", "indian"); //very dark yellow
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
