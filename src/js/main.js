

let numOfLine = 1;
const momentZero = moment([0, 0, 1]);

const segmentLength = 'M';


let linesDataArr = [{
    extFrom: 0,
    extTo: 0,
    color: '',
    synchronised: 0
}];
// linesDataArr[0] = {
//     extFrom: 0,
//     extTo: 0,
//     color: '',
//     synchronised: 0
// };

const music = ['The Beatles', 'The Kinks', 'The Doors', 'David Bowie', 'New Order', 'Depeche Mode', 'Blondie', 'Nautilus Pompilius'];
const randomSubject = ['Van Gogh', 'Berlin, Germany', 'Elon Musk', 'John Kennedy', 'Metallica', 'Depeche Mode', 'Banksy', 'The Beatles', 'David Bowie', 'The Doors'];

inputAutocomplete();

$('.add-line-button').on('click', addLine);

function addLine(){

    const date = moment([+$('.input-from').val(), 0, 1]);  

    linesDataArr[numOfLine] = {};
    linesDataArr[numOfLine].momentFrom = moment([+$('.input-from').val(), 0, 1]);
    linesDataArr[numOfLine].momentTo = moment([(+$('.input-to').val()) + 1, 0, 1]);
    linesDataArr[numOfLine].extFrom = linesDataArr[numOfLine].from = linesDataArr[numOfLine].momentFrom.diff(momentZero, segmentLength);
    linesDataArr[numOfLine].extTo = linesDataArr[numOfLine].to = linesDataArr[numOfLine].momentTo.diff(momentZero, segmentLength);
    const subject = $('.input-subject').val();

    $.ajax({
        url: `http://localhost:3020/data?subject=${subject}`
    }).then(result => {
        console.log("RREDSULT", result);
        
    });



    linesDataArr[numOfLine].subject = $('.input-subject').val();
    linesDataArr[numOfLine].lineLength =  linesDataArr[numOfLine].momentTo.diff(linesDataArr[numOfLine].momentFrom, segmentLength);
    linesDataArr[numOfLine].color = getRandomColor();
    linesDataArr[numOfLine].synchronised = false;

    const lineTitleEnding = 'from ' + $('.input-from').val() + ' to ' + $('.input-to').val();  
    const subjectWikiUrl = 'https://en.wikipedia.org/wiki/' + linesDataArr[numOfLine].subject.replaceAll(' ','_') + '_(band)';
    // console.log(subjectWikiUrl);
    
    $('.lines-container').append(`<div class="line-panel line-panel-${numOfLine}"></div>`)
    $(`.line-panel-${numOfLine}`).append(`<div class="line-title line-${numOfLine}-title"><h2><a href="${subjectWikiUrl}" target="blank">${linesDataArr[numOfLine].subject}</a>${lineTitleEnding}<h2></div>`);
    //$(`.line-${numOfLine}-title`).css("color", linesDataArr[numOfLine].color);
    $(`.line-panel-${numOfLine}`).append(`<div class="line line-${numOfLine}"></div>`);
    // $(`.line-${numOfLine}`).css("background-color", linesDataArr[numOfLine].color);


    for(let i = linesDataArr[numOfLine].from; i <= linesDataArr[numOfLine].to; i++) {

        const $segment = $(`<div class="segment segment_${i}"></div>`)

        $(`.line-${numOfLine}`).append($segment);
        $segment.css("background-color", linesDataArr[numOfLine].color)
        if (i !== 0) date.add(1, segmentLength);
        let format = 'YYYY';
        // console.log(date.format(format));

// stretch on hover
        $(`.segment_${i}`).data("number", i);
        $(`.segment_${i}`).on("mouseenter", mouseEnterHandler);
        $(`.segment_${i}`).on("mouseleave", mouseLeaveHandler);
        $(`.segment_${i}`).on("click", clickHandler);

// show div indexes
        if((i === 0) || i === linesDataArr[numOfLine].lineLength || (i % 12) === 0) {

        $(`.line-${numOfLine} .segment_${i}`).append(`<div class="segment-date">${date.format(format)}</div>`);
        }   

        // const gap = Math.round(linesDataArr[numOfLine].lineLength/4);

        // if((i === 0) || i === linesDataArr[numOfLine].lineLength || (i % gap) === 0) {

        //     $(`.line-${numOfLine} .segment_${i}`).append(`<div class="segment-date">${date.format(format)}</div>`);
        // }
    }
    $(`.line-${numOfLine}-title`).append(`<div class = "synch-panel synch-panel-${numOfLine}"></div>`);


// add synch button


    if(numOfLine !== 1) {

        if(linesDataArr[0].synchronised) {

            // $(`.synch-panel-${numOfLine}`).append('<span>Synchronize with </span>');

            addSynchButton(numOfLine,0);

        } else {

            for(let i = 1; i <= numOfLine; i++) {

                for(let k = 1; k <= numOfLine; k++) {

                    if(i !== k) {

                        if(!$(`.line-${i}-title .synch-with-${k}`)[0]) {

                            addSynchButton(i,k);
                        }
                    }
                }
            }
            
        }
    }
    inputAutocomplete();

    numOfLine++;
}

function synchronise(event) {

    let line1 = event.data.line1;

    if (linesDataArr[0].synchronised) {

        addExtraDivs(line1, 0);

        linesDataArr[0].extFrom = linesDataArr[line1].extFrom;
        linesDataArr[0].extTo = linesDataArr[line1].extTo;
        linesDataArr[0].synchronised++;
        linesDataArr[line1].synchronised = true;

        updateSynchButtonColor();

//update buttons
        $(`.synch-panel button`).remove();

        for(let i = 1; i < numOfLine; i++) {

            if(linesDataArr[i].synchronised) {
                
                addDesynchButton(i);

            } else {
                
                addSynchButton(i);
            }
        }
    } else {
        
        let line2 = event.data.line2;

        const endGap = linesDataArr[line2].extTo - linesDataArr[line1].extTo;
        const startGap = linesDataArr[line2].extFrom - linesDataArr[line1].extFrom;

        addExtraDivs(line1, line2);

        linesDataArr[0].extFrom = linesDataArr[line2].extFrom;
        linesDataArr[0].extTo = linesDataArr[line2].extTo;
        linesDataArr[0].synchronised = 2;
        linesDataArr[line1].synchronised = linesDataArr[line2].synchronised = true;
        
        updateSynchButtonColor();

//update button
        $(`.synch-panel button`).remove();

        for(let i = 1; i < numOfLine; i++) {

            if(i === line1 || i === line2) {
                
                addDesynchButton(i);

            } else {

                addSynchButton(i, 0);
            }
        }
    }
}

function desynchronise (event) {

    let line = event.data.line1;    

    $(`.line-${line} .extra-div`).remove();

    linesDataArr[0].synchronised--;
    linesDataArr[line].synchronised = false;
    linesDataArr[line].extFrom = linesDataArr[line].from;
    linesDataArr[line].extTo = linesDataArr[line].to;

    if(linesDataArr[0].synchronised < 2) {

        $(`.extra-div`).remove();

        linesDataArr[0].color = ''
        linesDataArr[0].synchronised = 0;

        for(let i = 1; i < numOfLine; i++ ) {

            linesDataArr[i].synchronised = false;
            linesDataArr[i].extFrom = linesDataArr[i].from;
            linesDataArr[i].extTo = linesDataArr[i].to;
        }

//update synch buttons
        $(`.synch-panel button`).remove();

        // $(`.extra-div`).remove();

        for(let i = 1; i < numOfLine; i++) {

            for(let k = 1; k < numOfLine; k++) {

                if(i !== k) {

                    addSynchButton(i, k);
                }
            }
        }
    } else {

        updateSynchButtonColor();

// update synch buttons
        for(let i = 1; i < numOfLine; i++) {

            if(!linesDataArr[i].synchronised) {

                $(`.synch-panel-${i} button`).remove();
                addSynchButton(i);
            }            
        }
    }
}

function mouseEnterHandler() {
    const n = $(this).data("number");
    $(`.segment_${n}`).attr('data-opened', 'true');
    $(`.segment_${n}`).css({"flex-grow": 20});
}
  
function mouseLeaveHandler() {
    $('[data-opened=true]').css({ "flex-grow": 1 });
}

function clickHandler() {

    $(this).text('sometext')
}

function getRandomColor() {

    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

function inputAutocomplete() {

    let from = Math.floor(Math.random() * 5 + 1975);
    let to = Math.floor(Math.random() * 5 + 1980);

    let subjectId = Math.floor(Math.random() * music.length);
    let subject = music[subjectId];
    music.splice(subjectId, 1);

    $('.input-subject').attr("size", subject.length - 3);

    $('.input-subject').val(subject);
    $('.input-from').val(" " + from);
    $('.input-to').val(" " + to);


    //subject input field length handler

    $('.input-subject').on('input', () => {
        const l = ($('.input-subject').val()).length;
        $('.input-subject').attr("size", 1);
        if (l > 4) $('.input-subject').attr("size", l - 4);
    })
}

function updateSynchButtonColor() {

    linesDataArr[0].color = 'linear-gradient(0.2turn';

    for(let i = 1; i < numOfLine; i++) {

        if(linesDataArr[i].synchronised) {

            linesDataArr[0].color += ", " + linesDataArr[i].color;

        }
    }

linesDataArr[0].color += ')';

}

function addExtraDivs(line1, line2) {

    const endGap = linesDataArr[line2].extTo - linesDataArr[line1].extTo;
    const startGap = linesDataArr[line2].extFrom - linesDataArr[line1].extFrom;

    if(line2 === 0) {

        if(endGap != 0) {

            for(let i = 0; i < Math.abs(endGap); i++) {
        
                if(endGap > 0) {
        
                    $(`.line-${line1}`).append('<div class="extra-div"></div>');
        
                    linesDataArr[line1].extTo++;
        
                } else {   
        
                    for(let k = 1; k < numOfLine; k++) {
        
                        if( linesDataArr[k].synchronised === true) {
        
                            $(`.line-${k}`).append('<div class="extra-div"></div>')
        
                            linesDataArr[k].extTo++;
        
                        }
                    }                    
                }
            }
        }
        
        if (startGap != 0) {

            for(let i = 0; i< Math.abs(startGap); i++) {
        
                if(startGap < 0) {
        
                    $(`.line-${line1}`).prepend('<div class="extra-div"></div>');
        
                    linesDataArr[line1].extFrom--;
        
                } else {
        
                    for(let k = 1; k < numOfLine; k++) {
        
                        if( linesDataArr[k].synchronised === true) {
        
                            $(`.line-${k}`).prepend('<div class="extra-div"></div>')
        
                            linesDataArr[k].extFrom--;
        
                        }
                    }
        
                }
            }
        }

    } else {

        if(endGap != 0) {

            for(let i = 0; i < Math.abs(endGap); i++) {

                const line = endGap > 0 ? line1 : line2;
                $(`.line-${line}`).append('<div class="extra-div"></div>');

                linesDataArr[line].extTo++;
            }
        }

        if (startGap != 0) {

            for(let i = 0; i< Math.abs(startGap); i++) {

                const line = startGap < 0 ? line1 : line2;
                $(`.line-${line}`).prepend('<div class="extra-div"></div>');

                linesDataArr[line].extFrom--;
            }
        }
    }

    
}

function addSynchButton(line1, line2) {

    if(line2) {

        const $button = $(`<button class="synch-button synch-with-${line2}">${linesDataArr[line2].subject}</button>`)
        $(`.synch-panel-${line1}`).append($button);
        $button.css("background", linesDataArr[line2].color);
        $button.on('click', {'line1':line1, 'line2':line2}, synchronise); 

    } else {

        let synchronizedSubjects = '';

        for(i = 1; i < numOfLine; i++) {

            if(linesDataArr[i].synchronised) {

                synchronizedSubjects += linesDataArr[i].subject + ', ';
            }
        }

        synchronizedSubjects = synchronizedSubjects.substring(0, synchronizedSubjects.length - 2);

        const $button = $(`<button class="synch-button synchronize">${synchronizedSubjects}</button>`);
        $(`.synch-panel-${line1}`).append($button);
        $button.css("background", linesDataArr[0].color);
        $button.on('click', {'line1':line1}, synchronise);
    }
}

function addDesynchButton(line) {

    const $button = $(`<button class = "synchronized synch-button">Desynchronise</button>`);
    $(`.synch-panel-${line}`).append($button);
    $button.on('click', {'line1':line}, desynchronise);
} 






