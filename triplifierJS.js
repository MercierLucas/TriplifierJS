var TriplifierJS = function()
{
    // buttons
    var _downloadButton;
    var _generateButton;

    var _inputFile;

    // options
    var _includeHeader;
    var _headerLine;
    var _separator;
    var _clear;
    var _specficStartLine;
    var _specficEndLine;
    var _startLine;
    var _endLine;

    // i/o
    var _result;
    var _rawCSV;

    $(document).ready(function()
    {
        init();

        _clear.on("click",function(e)
        {
            e.preventDefault();
            _rawCSV.val("");
        });

       _generateButton.on("click",function()
        {
            getParameters();
        });

        _inputFile.on("change",function(event)
        {
            loadFile(event);
        });

        _downloadButton.on("click",function()
        {
            downloadTurtle(_result.text());
        });
        
        _includeHeader.on("click",function()
        {
            updateHeaderBlock();
        });

        _specficStartLine.on("click",function()
        {
            updateStartBlock();
        });

        _specficEndLine.on("click",function()
        {
            updateEndBlock();
        });
    });

    function updateHeaderBlock()
    {
        var show = _includeHeader.prop("checked");
        $("#header-block").css("display", show ? "grid" : "none")
        _headerLine.val(show ? 1 : 0);
    }
    function updateStartBlock()
    {
        var show = _specficStartLine.prop("checked");
        $("#start-block").css("display",show ? "grid" : "none");
        _startLine.val(show ? 1 : 0);
    }

    function updateEndBlock()
    {
        var show = _specficEndLine.prop("checked");
        $("#end-block").css("display",show ? "grid" : "none");
        _endLine.val(show ? getCurrentCSVLength() : -1);
    }

    function init()
    {
        _downloadButton = $("#download");
        _generateButton = $("#generate");
        _includeHeader = $("#include-header");
        _headerLine = $("#header-line");
        _separator = $("#separator");
        _inputFile = $("#csv-file");
        _result = $("#result");
        _rawCSV = $("#raw-csv");
        _clear = $("#clear");
        _specficStartLine = $("#specific-start");
        _specficEndLine = $("#specific-end");
        _startLine = $("#start-line");
        _endLine = $("#end-line");

        updateStartBlock();
        updateEndBlock();
        updateHeaderBlock();
    }

    function getCurrentCSVLength()
    {
        return _rawCSV.val().split("\n").length;
    }

    function loadFile(event)
    {
        var input = event.target;

        var reader = new FileReader();

        reader.onload = function()
        {
            _rawCSV.val(reader.result);
        }
        reader.readAsText(input.files[0]);
    }

    function getParameters()
    {
        var separator = _separator.val();
        var headerLine = parseInt(_headerLine.val());
        var csv = _rawCSV.val();
        var startLine = parseInt(_startLine.val());
        var endLine = parseInt(_endLine.val());

        var turtle = generateCSV(csv,separator,headerLine,startLine,endLine);

        _result.text(turtle);
    }

    function downloadTurtle(ttl)
    {
        // https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
        // credits to @mikemaccana 
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ttl));
        element.setAttribute('download', "test.ttl");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function generateCSV(csv, separator, headerLine, startingLine, endingLine)
    {
        var turtle = "@prefix data: <http://ex.org/data/>. \n@prefix pred: <http://ex.org/predicat/>. \n \n";

        var lines = csv.split("\n");
        console.log(lines);
        var n_colonnes = lines[0].split(separator).length;
        var predicats = [];

        var startLine = startingLine == 0 ? (headerLine == 0 ? 1 : 0) : startingLine;
        var endLine = endingLine == -1 ? lines.length - 1 : endingLine;

        if(headerLine != 0)
        {
            predicats = lines[headerLine-1].split(separator);
        }
        else
        {
            for (let i = 0; i < n_colonnes; i++)
            {
                predicats.push("Pred"+i);
            }
        }
        for (let nLine = startLine; nLine <= endLine; nLine++)
        {
            if(nLine == headerLine - 1) continue;

            var element = "data:"+nLine;
            var line = lines[nLine];
            var words = line.split(separator);

            for (let nWord = 0; nWord < words.length; nWord++)
            {
                var word = words[nWord];

                var object = isNaN(parseFloat(word)) ? "\""+word+"\"" : parseFloat(word);

                if(nWord == 0)
                {
                    element += "\t \t";
                }
                else
                {
                    element += "\t \t \t";
                }

                element += "pred:"+predicats[nWord]+" "+object;

                if(nWord + 1 < words.length)
                {
                    element += "; \n";
                }
                else
                {
                    element += ". \n \n";
                }
            }
            turtle += element;
        }

        return turtle;
        
    }
}();

