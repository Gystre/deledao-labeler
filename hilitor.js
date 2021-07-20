// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.

class Hilitor {
    // characters to strip from start and end of the input string
    static endRegExp = new RegExp("^[^\\w]+|[^\\w]+$", "g");

    // characters used to break up the input string into words
    static breakRegExp = new RegExp("[^\\w'-]+", "g");

    constructor(id, tag) {
        // private variables
        this.targetNode = document.getElementById(id) || document.body;
        this.hiliteTag = tag || "MARK";
        this.skipTags = new RegExp(
            "^(?:" + this.hiliteTag + "|SCRIPT|FORM|SPAN)$"
        );
        this.colors = ["#ffaabb", "#a0ffff", "#9f9", "#f99", "#f6f"];
        this.wordColor = [];
        this.colorIdx = 0;
        this.matchRegExp = "";
        this.openLeft = false;
        this.openRight = false;
    }

    setMatchType(type) {
        switch (type) {
            case "left":
                this.openLeft = false;
                this.openRight = true;
                break;

            case "right":
                this.openLeft = true;
                this.openRight = false;
                break;

            case "open":
                this.openLeft = this.openRight = true;
                break;

            default:
                this.openLeft = this.openRight = false;
        }
    }

    setRegex(input) {
        input = input.replace(Hilitor.endRegExp, "");
        input = input.replace(Hilitor.breakRegExp, "|");
        input = input.replace(/^\||\|$/g, "");
        if (input) {
            var re = "(" + input + ")";
            if (!this.openLeft) {
                re = "\\b" + re;
            }
            if (!this.openRight) {
                re = re + "\\b";
            }
            this.matchRegExp = new RegExp(re, "i");
            return this.matchRegExp;
        }
        return false;
    }

    getRegex() {
        var retval = this.matchRegExp.toString();
        retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
        retval = retval.replace(/\|/g, " ");
        return retval;
    }

    // recursively apply word highlighting
    hiliteWords(node, hexColor) {
        if (node === undefined || !node) return;
        if (!this.matchRegExp) return;
        if (this.skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i], hexColor);
        }
        if (node.nodeType == 3) {
            // NODE_TEXT
            if (
                (this.nv = node.nodeValue) &&
                (this.regs = this.matchRegExp.exec(this.nv))
            ) {
                if (!this.wordColor[this.regs[0].toLowerCase()]) {
                    this.wordColor[this.regs[0].toLowerCase()] = hexColor;
                }

                var match = document.createElement(this.hiliteTag);
                match.appendChild(document.createTextNode(this.regs[0]));
                match.style.backgroundColor =
                    this.wordColor[this.regs[0].toLowerCase()];
                match.style.color = "#000";

                var after = node.splitText(this.regs.index);
                after.nodeValue = after.nodeValue.substring(
                    this.regs[0].length
                );
                node.parentNode.insertBefore(match, after);
            }
        }
    }

    // remove highlighting
    remove() {
        var arr = document.getElementsByTagName(this.hiliteTag);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    }

    // start highlighting at target node
    apply(input, hexColor) {
        // this.remove();
        if (
            input === undefined ||
            !(input = input.replace(/(^\s+|\s+$)/g, ""))
        ) {
            return;
        }
        if (this.setRegex(input)) {
            this.hiliteWords(this.targetNode, hexColor);
        }
        return this.matchRegExp;
    }
}
