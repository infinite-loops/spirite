/**
 * Created by Ivan Taranin (john) on 21.11.20.
 * [ivan.taranin@infiniteloops.de]
 */

const maths = [
    '\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)',
    '\\(\\frac{1}{\\sqrt{x}}\\)',
    '\\[' +
    '\\begin{matrix}' +
    '1 & 0\\\\' +
    '0 & 1' +
    '\\end{matrix}' +
    '\\]',
    'x = a_0 + \\frac{1}{a_1 + \\frac{1}{a_2 + \\frac{1}{a_3 + a_4}}}'
];


class MarkovMaths {

    constructor(){


    }

    generate(length, complexity){

        const content = document.createElement('span')
        content.textContent = maths[Math.floor(Math.random() * maths.length)];
        const syncTypeset = document.querySelector('#maths');
        syncTypeset.appendChild(content.cloneNode(true)) ;
        setTimeout(function () {
            MathJax.typeset()
            // syncTypeset.appendChild(done.cloneNode(true))
        }, 0)
    }
}