let numOfLine = 1;
let synchronizedLinesArr = [];

let linesDataArr = [];
linesDataArr[0] = {
    extFrom: 0,
    extTo: 0,
    color: '',
};


inputAutocomplete();

// add line handler

$('.add-line-button').on('click', function(){
    linesDataArr[numOfLine] = {};
    linesDataArr[numOfLine].extFrom = linesDataArr[numOfLine].from = +$('.input-from').val();
    linesDataArr[numOfLine].extTo = linesDataArr[numOfLine].to = +$('.input-to').val();
    linesDataArr[numOfLine].subject = $('.input-subject').val();
    linesDataArr[numOfLine].lineLength =  linesDataArr[numOfLine].to - linesDataArr[numOfLine].from;
    linesDataArr[numOfLine].color = getRandomColor();
    linesDataArr[numOfLine].synchronised = false;

    lineTitle = linesDataArr[numOfLine].subject + ' from ' + linesDataArr[numOfLine].from + ' to ' + linesDataArr[numOfLine].to

    const gap = Math.round(linesDataArr[numOfLine].lineLength/4);

    

    $('.lines-container').append(`<div class="line-title line-${numOfLine}-title"><p>${lineTitle}</p></div>`);

    $('.lines-container').append(`<div class="line line-${numOfLine}"></div>`);
    $(`.line-${numOfLine}`).css("background-color", linesDataArr[numOfLine].color);


    for(let i = linesDataArr[numOfLine].from; i <= linesDataArr[numOfLine].to; i++) {
        $(`.line-${numOfLine}`).append(`<div class="segment segment_${i}"></div>`);

// stretch on hover
        $(`.segment_${i}`).data("number", i);
        $(`.segment_${i}`).on("mouseenter", mouseEnterHandler);
        $(`.segment_${i}`).on("mouseleave", mouseLeaveHandler);
        $(`.segment_${i}`).on("click", clickHandler);

// show box indexes
        if((i === linesDataArr[numOfLine].from) || i === linesDataArr[numOfLine].to || ((i - linesDataArr[numOfLine].from) % gap) === 0) {
            $(`.line-${numOfLine} .segment_${i}`).append(`<div class="segment-number">${i}</div>`);
        }
    }
    

// add synch button
    if(numOfLine !== 1) {

        if(!linesDataArr[0].extTo) {

            for(let i = 1; i <= numOfLine; i++) {
                for(let k = 1; k <= numOfLine; k++) {
                    if(i !== k) {
                        
                        if(!$(`.line-${i}-title .synch-with-${k}`)[0]) {
                            $(`.line-${i}-title`).append(`<button class="synch synch-with-${k}">Synchronise</button>`);
                            $(`.synch-with-${k}`).css("background", linesDataArr[k].color);
                            $(`.synch-with-${k}`).on('click', {'line1':i, 'line2':k}, synchronise);
                        }
                    }
                }
            }

        } else {

            $(`.line-${numOfLine}-title`).append(`<button class="synch synchronized">Synchronise</button>`);
            $(`.synchronized`).css("background-color", linesDataArr[0].color);
            $(`.synchronized`).on('click', {'line1':0}, synchronise);
            
            for(let i = 1; i < numOfLine; i++) {
                $(`.line-${i}-title`).append(`<button class="synch synch-with-${numOfLine}">Synchronise</button>`);
                $(`.synch-with-${numOfLine}`).css("background-color", linesDataArr[numOfLine].color);
                $(`.synch-with-${numOfLine}`).on('click', {'line1':i, 'line2':numOfLine}, synchronise);
                                

                if(linesDataArr[i].synchronised) {
                    
                }

            }
        }
    }
    



    inputAutocomplete();

    numOfLine++;
})

function inputAutocomplete() {
    let a = Math.floor(Math.random() * 10 + 1960);
    let b = Math.floor(Math.random() * 10 + 1970);

    const subjArr = ['Van Gogh', 'Berlin, Germany', 'Elon Musk', 'John Kennedy', 'Metallica', 'Depeche Mode'];
    let c = subjArr[Math.floor(Math.random() * 5)];

    $('.input-subject').attr("size", c.length - 3);

    $('.input-subject').val(c);
    $('.input-from').val(a);
    $('.input-to').val(b);


    //subject input field length handler

    $('.input-subject').on('input', () => {
        const l = ($('.input-subject').val()).length;
        $('.input-subject').attr("size", 1);
        if (l > 4) $('.input-subject').attr("size", l - 4);
    })
}

function synchronise(event) {

    
    let line1 = event.data.line1;
    let line2;

    if (!linesDataArr[0].extTo) {

        line2 = event.data.line2;
    } else {
        line2 = 0;
    }

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

    linesDataArr[0].extFrom = linesDataArr[line2].extFrom
    linesDataArr[0].extTo = linesDataArr[line2].extTo

    linesDataArr[0].color = `linear-gradient(0.25turn, ${linesDataArr[line1].color}, ${linesDataArr[line2].color})`

    $(`.line-${line2}-title .synch-with-${line1} `).html('Desynchronise');
    $(`.line-${line2}-title .synch-with-${line1} `).css("background", linesDataArr[0].color);
    $(`.line-${line2}-title .synch-with-${line1} `).off();
    $(`.line-${line2}-title .synch-with-${line1} `).on('click', {'line1':line2, 'line2':line1}, desynchronise);

    $(`.line-${line1}-title .synch-with-${line2} `).html('Desynchronise');
    $(`.line-${line1}-title .synch-with-${line2} `).css("background", linesDataArr[0].color);
    $(`.line-${line1}-title .synch-with-${line2} `).off()
    $(`.line-${line1}-title .synch-with-${line2} `).on('click', {'line1':line1, 'line2':line2}, desynchronise);

    linesDataArr[line2].synchronised = linesDataArr[line2].synchronised = true;

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

