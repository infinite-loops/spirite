/**
 * Created by Ivan Taranin (john) on 20.11.20.
 * [ivan.taranin@infiniteloops.de]
 */



function setup() {
    createCanvas(windowWidth, windowHeight);
    background('rgba(0,0,0, 0.25)');
    noStroke();
    noLoop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // drawCircle(width / 2, 280, 6);
}

function drawCircle(x, radius, level) {
    const tt = (126 * level) / 4.0;
    fill(tt);
    ellipse(x, height / 2, radius * 2, radius * 2);
    if (level > 1) {
        level = level - 1;
        drawCircle(x - radius / 2, radius / 2, level);
        drawCircle(x + radius / 2, radius / 2, level);
    }
}

class Narrative {
    constructor() {
        this.params = {
            narrative: {
                wpm: 330,
                pauseBeforePhrase: 500,
                pauseInBetween: 1000,
                pauseAfterPhrase: 2500,
            },

            scrambler: {
                enabled: false,
                scrambleFactor: 0
            }
        };
        this.mText = new MarkovText(EX0, 4);
        this.mMaths = new MarkovMaths();
        this.scrambler = new TextScramble(document.getElementById('sub'), this.scramblerStart, this.scramblerEnd.bind(this));
        this.phrase = {words: []};
        this.loop = {
            handle: null,
            running: false,
            currentTime: 0,
        };

        this.intensity = new Intensity();

        console.log('narrative init >>', this)
        // console.log('2>>>', source, archive)
    }

    advance() {
        this.intensity.transition();
        const phr = this.intensity.value();

        let txt;
        // console.log('>> advance', txt, phr)
        //TODO?
        if(this.intensity.value() === 0){
            txt = ['this is ', 'a thought '];
        }

        else {
            txt = [this.mText.generate(phr)];
            // this.mMaths.generate(2, 5)
        }

        this.phrase = this.karaokefy(txt);
        this.counter = 0;
        console.log('-->',txt, this.phrase)

        this.stop();
        this.scrambler.setText(txt, this.params.scrambler).then(() => {
            // console.log('text set', txt)
            this.textSet = true;
            setTimeout(this.start.bind(this), this.params.narrative.pauseBeforePhrase);
        });
    }

    timeUpdate(elapsed){

        if(!this.textSet) {
            return;
        }
        const part = this.phrase.words[this.counter];
        const textEl = document.getElementById('sub');
        // console.log('loop', elapsed, part)
        part.forEach((x,i) => {
            if (elapsed >= x.start && elapsed <= x.end){
                document.getElementById('word-'+i).style.opacity = '1';
                // console.log('>> showing', i)
                // x.media.forEach(e => e());
            }
        });
        //sub phrase change
        if(this.counter < this.phrase.words.length - 1 && (elapsed > part[part.length - 1].end)) {
            this.counter ++;
            const nxt = this.phrase.phrases[this.counter];
            // console.log('>> removing', nxt)
            while(textEl.firstChild){
                textEl.removeChild(textEl.firstChild);
            }
            textEl.innerHTML = this.scrambler.spanify(nxt).join(' ');
            return;
        }
        //end of phrase
        if(elapsed > part[part.length - 1].end + 2.5){   //TODO -> ui
            // console.log('>> stop')
            const m = document.querySelector('#maths');
            while(m.firstChild){
                m.removeChild(m.firstChild);
            }
            this.stop();
            setTimeout(() => {
                this.textSet = false;
                this.advance();
                if(Math.random() < 0.5){
                    const s = Math.floor(Math.random() * 7);
                    glsl.loadFragment(`gl/test${s}.frag`);
                }
            }, this.params.pauseAfterPhrase);
        }
    }

    karaokefy(phrase){
        let s = 0;
        // let pd = 0;
        const ret = {phrases: [], words: []};
        for(let k = 0; k < phrase.length; ++k){
            const r = phrase[k].split(' ').map((word, i, a) => {
                const d = timeToReadF(word, this.params.narrative.wpm);
                const start = s;
                let end = s + d + (Math.random() < 0.5 ? Math.random() * 0.5 : 0); //TODO experimental
                // const media = [];

                s = end;

                if(i === a.length - 1){
                    s = end = end + this.params.narrative.pauseInBetween / 1000;
                }

                return {
                    start: start,
                    end: end,
                    duration: d,
                    word: word,
                    wordLength: word.length,
                    id: i,
                    // media: media
                }
            });
            ret.words.push(r);
            ret.phrases.push(phrase[k]);
            // this.pickMedia(r, k);
        }

        // const phr = {
        //     totalCharLength: phrase.length,
        //     WordsByLength: r.sort((x,y) => {return y.wordLength - x.wordLength})
        // };
        return ret;
    }
    start(ts ) {

        if (!this.loop.currentTime) {
            this.loop.currentTime = ts;
        }
        let p = ts - this.loop.currentTime;

        this.timeUpdate(p / 1000);
        this.loop.handle = requestAnimationFrame(this.start.bind(this), 60 / 25);  //TODO param
    }

    stop() {
        cancelAnimationFrame(this.loop.handle);
        this.loop.currentTime = 0;
    }

    scramblerStart() {
        // console.log('> scrambler start')
    }

    scramblerEnd(txt) {
        // console.log('> scrambler end')
    }
}


class Intensity {

    constructor(params){

        this.r = {
            range: {min: 6, max: 12},
            value: 0
        };
        this.history = [];
        this.range = this.r.range;//params.range;
        this.val = this.r.value;
        this.first = true;
    }

    transition(){
        const f = Math.random();    //TODO oscillator sum, or something
        const g = Math.floor(Math.random() * 2);
        if(this.first) {    //TODO generalize
            this.val = 0;
            this.first = false;
            return this.value();
        }

        if (this.value() === 0){
            this.val = Math.random() < 0.5 ? -4 : 4;
            return this.value();
        }
        else{
            if(f < 0.5){
                this.val === this.range.min ? this.val += g : this.val -= g;
            }
            // else if (f === 0.5){
            //     //TODO super unlikely - easter egg?
            // }
            else {
                this.val === this.range.max ? this.val -= g : this.val += g;
            }

            return this.value();
        }
    }
    value(){
        return Math.abs(this.val);
    }
}
//in seconds
function timeToReadF(text, wpm) {
    const noOfWords = text.split(/\s/g).length;
    return (noOfWords / wpm) * 60;
}

