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

    // i/o
    var _result;
    var _rawCSV;

    $(document).ready(function()
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
            changeHeaderOptions(_includeHeader.prop("checked"));
        });
    });

    function changeHeaderOptions(checked)
    {
        _headerLine.prop("disabled",!checked);
        _headerLine.val(0);
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
        var headerLine = _headerLine.val();
        var csv = _rawCSV.val();
        var turtle = generateCSV(csv,separator,headerLine);

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

    function generateCSV(csv, separator, headerLine)
    {
        var headerLine = parseInt(headerLine);
        console.log("Separator "+separator);
        console.log("HeaderLine "+headerLine);

        var turtle = "@prefix data: <http://ex.org/data/>. \n@prefix pred: <http://ex.org/predicat/>. \n \n";

        var lines = csv.split("\n");
        console.log(lines);
        var n_colonnes = lines[0].split(separator).length;
        var predicats = [];
        var startLine = headerLine == 0 ? 1 : 0;
        var endLine = lines.length-1;

        if(headerLine != 0)
        {
            predicats = lines[headerLine-1].split(separator);
            console.log(lines[headerLine-1]);
        }
        else
        {
            for (let i = 0; i < n_colonnes; i++)
            {
                predicats.push("Pred"+i);
            }
        }

        for (let nLine = startLine; nLine < endLine; nLine++)
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

