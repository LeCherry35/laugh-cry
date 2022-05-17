let numOfLines = 0;
let synchronizedLinesArr = [];
let maxExt;
let minExt;

let linesDataArr = [];


inputAutocomplete();

// add line handler

$('.add-line-button').on('click', function(){
    linesDataArr[numOfLines] = {};
    linesDataArr[numOfLines].extFrom = linesDataArr[numOfLines].from = +$('.input-from').val();
    linesDataArr[numOfLines].extTo = linesDataArr[numOfLines].to = +$('.input-to').val();
    linesDataArr[numOfLines].subject = $('.input-subject').val();
    linesDataArr[numOfLines].lineLength =  linesDataArr[numOfLines].to - linesDataArr[numOfLines].from;
    linesDataArr[numOfLines].color = getRandomColor();

    lineTitle = linesDataArr[numOfLines].subject + ' from ' + linesDataArr[numOfLines].from + ' to ' + linesDataArr[numOfLines].to

    const gap = Math.round(linesDataArr[numOfLines].lineLength/4);

    

    $('.lines-container').append(`<div class="line-title line-${numOfLines}-title"><p>${lineTitle}</p></div>`);

    $('.lines-container').append(`<div class="line line-${numOfLines}"></div>`);
    $(`.line-${numOfLines}`).css("background-color", linesDataArr[numOfLines].color);


    for(let i = linesDataArr[numOfLines].from; i <= linesDataArr[numOfLines].to; i++) {
        $(`.line-${numOfLines}`).append(`<div class="segment segment_${i}"></div>`);

        $(`.segment_${i}`).data("number", i);
        $(`.segment_${i}`).on("mouseenter", mouseEnterHandler);
        $(`.segment_${i}`).on("mouseleave", mouseLeaveHandler);
        $(`.segment_${i}`).on("click", clickHandler);

// show box indexes
        if((i === linesDataArr[numOfLines].from) || i === linesDataArr[numOfLines].to || ((i - linesDataArr[numOfLines].from) % gap) === 0) {
            $(`.line-${numOfLines} .segment_${i}`).append(`<div class="segment-number">${i}</div>`);
        }
    }
    

// add synch button
    if(numOfLines !== 0) {

        for(let i = 0; i <= numOfLines; i++) {
            for(let k = 0; k <= numOfLines; k++) {
                if(i !== k) {
                    
                    if(!$(`.line-${i}-title .synch-with-${k}`)[0]) {
                        $(`.line-${i}-title`).append(`<button class="synch synch-with-${k}">Synchronise</button>`);
                        $(`.synch-with-${k}`).css("background-color", linesDataArr[k].color);
                        $(`.synch-with-${k}`).on('click', {'line1':i, 'line2':k}, synchronise);
                    }
                }
            }
           
        
            
        }
    }
    



    inputAutocomplete();

    numOfLines++;
})

function inputAutocomplete() {
    let a = Math.floor(Math.random() * 10 + 1960);
    let b = Math.floor(Math.random() * 10 + 1970);

    const subjArr = ['Van Gogh', 'Berlin, Germany', 'Elon Musk', 'John Kennedy', 'Metallica', 'Depeche Mode'];
    let c = subjArr[Math.floor(Math.random() * 5)];

    $('.input-subject').attr("size", c.length - 3);

    $('.input-subject').attr("value", c);
    $('.input-from').attr("value", a);
    $('.input-to').attr("value", b);


    //subject input field length handler

    $('.input-subject').on('input', () => {
        const l = ($('.input-subject').val()).length;
        $('.input-subject').attr("size", 1);
        if (l > 4) $('.input-subject').attr("size", l - 4);
    })
}

function synchronise(event) {
    let line1 = event.data.line1;
    let line2 = event.data.line2;

    if(linesDataArr[line1].extFrom !== linesDataArr[line2].extFrom || linesDataArr[line1].extTo !== linesDataArr[line2].extTo) {
        

        const endGap = linesDataArr[line2].extTo - linesDataArr[line1].extTo;
        const startGap = linesDataArr[line2].extFrom - linesDataArr[line1].extFrom;
        
        if(endGap != 0) {
            for(let i = 0; i < Math.abs(endGap); i++) {
                // extradiv.className = `${i}`
                const line = endGap > 0 ? line1 : line2;
                $(`.line-${line}`).append('<div class="extra-div"></div>');

                linesDataArr[line].extTo++;
            }
        }

        if (startGap != 0) {
            for(let i = 0; i< Math.abs(startGap); i++) {
                // extradiv.className = `${i}`
                const line = startGap < 0 ? line1 : line2;
                $(`.line-${line}`).prepend('<div class="extra-div"></div>');

                linesDataArr[line].extFrom--;
            }
        }

        linesDataArr[line1].extLineLength = linesDataArr[line2].extLineLength = Math.max(linesDataArr[line2].to, linesDataArr[line1].to) - Math.min(linesDataArr[line2].from, linesDataArr[line1].from);
    } 



    if(linesDataArr[line1].extFrom == linesDataArr[line2].extFrom && linesDataArr[line1].extTo == linesDataArr[line2].extTo) {
        $(`.line-${line2}-title .synch-with-${line1} `).html('Desynchronise');
        $(`.line-${line2}-title .synch-with-${line1} `).css("background", `linear-gradient(0.25turn, ${linesDataArr[line1].color}, ${linesDataArr[line2].color})`);
        $(`.synch-with-${line2}`).off();
        $(`.synch-with-${line2}`).on('click', {'line1':line1, 'line2':line2}, desynchronise)
        $(`.line-${line1}-title .synch-with-${line2} `).html('Desynchronise');
        $(`.line-${line1}-title .synch-with-${line2} `).css("background", `linear-gradient(0.25turn, ${linesDataArr[line2].color}, ${linesDataArr[line1].color})`);
        $(`.synch-with-${line1}`).off()
        $(`.synch-with-${line1}`).on('click', {'line1':line2, 'line2':line1}, desynchronise);
    }

    synchronizedLinesArr.push(line1, line2);

    

    

}

function desynchronise (event) {
    let lineModif = event.data.line1;
    let lineOth = event.data.line2;
    $(`.line-${lineModif} .extra-div`).remove();
    let i = synchronizedLinesArr.indexOf(lineModif);
    synchronizedLinesArr.splice(i,1);
    if(synchronizedLinesArr.length = 1) {
        synchronizedLinesArr =[];
        $(`.line-${lineOth} .extra-div`).remove();
    }

}

function mouseEnterHandler() {
    const n = $(this).data("number");
    $(`.segment_${n}`).attr('data-opened', 'true');
    $(`.segment_${n}`).css({ "flex-grow": 20 });
}
  
function mouseLeaveHandler() {
    $('[data-opened=true]').css({ "flex-grow": 1 });
}

function clickHandler() {
    $(this).text('sometext')
    console.log(m);
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

