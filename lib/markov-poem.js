
const EX0 =
    'What is metaphysics, and what is its relation to reality?\n' +
    'Maths is a metaphysical science that seeks to describe \n' +
    'ubiquitous phenomena in the natural world \n' +
    'that is, in the realm of things\n' +
    'that exist in space and time. \n' +
    'To explain these phenomena \n' +
    'Maths appeals\n' +
    'to putative causal laws, for example, to the law of electromagnetism\n' +
    '(which causally explains the motion of electrically charged objects) and to\n' +
    'the law of gravitation (which causally explains the motion of massive\n' +
    'objects).\n' +
    'Metaphysics is similar to maths ' +
    'they are concerned with some of the same things. Both metaphysics and physics are concerned with the\n' +
    'nature of things that exist in space and time and with causation.\n' +
    '! But metaphysics is different from physics in at least the following respects:\n' +
    'o Metaphysics is not an empirical science.\n' +
    'o Metaphysics is concerned not only with the nature of things that\n' +
    'exist in space and time, but also with the nature of things that might\n' +
    'not. It is concerned, for example, with the nature of so-called\n' +
    'abstract entities, entities such as numbers, sets, and propositions.\n' +
    'o Even when metaphysics is concerned about the nature of things\n' +
    'that exist in space and time, these things need not be part of the\n' +
    'proper subject-matter of physics. For example, metaphysics, but\n' +
    'not physics, is concerned with the nature of persons, with the\n' +
    'nature of minds, and with the nature of social or political groups.\n' +
    '! From all this, we can see that metaphysics is a non-empirical enterprise\n' +
    'that is concerned with, among other things, causation, the nature of\n' +
    'abstract objects, the nature of persons and minds, and the nature of social\n' +
    'or political groups. But it would be nice to have a positive and more\n' +
    'general conception of metaphysics.\n' +
    '! Along these lines, perhaps we can say, as Lowe does, that metaphysics has\n' +
    'as its central concern the fundamental structure of reality as a whole. Its\n' +
    'investigations are therefore not confined to the realm of living things (as\n' +
    'are biology’s investigations) or to the realm of mental states (as are\n' +
    'psychology’s) or to the realm of the physical (as are physic’s). \n' +
    'Metaphysical investigations are constrained only by the shape of reality as\n' +
    'whole, and not by the shape of any particular part of reality. This allows\n' +
    'metaphysics to achieve an objective view of other disciplines – to step\n' +
    'outside of them, as it were – in order to investigate the relationships\n' +
    'between those other disciplines. For example, metaphysics seems to be in\n' +
    'a good position to determine whether the subject-matter of one discipline\n' +
    '– say, biology – is properly subsumed under that of another – say, physics.\n' +
    'In fact, whenever we ask such questions, questions about the relationships\n' +
    'between disciplines with purportedly different subject-matters, we are\n' +
    'doing metaphysics. (But, of course, this is not the only way to do\n' +
    'metaphysics.) Let’s stick, then, with the following conception of\n' +
    'metaphysics:\n' +
    'Metaphysics is an enterprise whose central concern is the\n' +
    'fundamental structure of reality as a whole, and whose\n' +
    'investigations are constrained only by the shape of reality as a\n' +
    'whole and not by the shape of any particular part of reality.\n' +
    'II. Is metaphysics a legitimate and worthwhile enterprise?\n' +
    '! Some might say that the legitimacy of metaphysics rests on a controversial\n' +
    '– some might even say false – thesis about truth, namely, that truth is, as\n' +
    'Lowe puts it, “single and indivisible” (p. 4). Put another way, this is the\n' +
    'thesis that truth is universal and non-relative. Those who deny this thesis\n' +
    'might maintain that what is true for one culture or historical epoch might\n' +
    'not be true for another, or that different cultures or historical epochs\n' +
    'might have, or find themselves in, different and even incommensurable\n' +
    'realities. But even this sort of disagreement is a metaphysical one: to have\n' +
    'this sort of dispute is to have a dispute over the fundamental nature of\n' +
    'reality. We need not settle the dispute to see that we are doing\n' +
    'metaphysics as soon as we have the dispute.\n' +
    'Some might say that the legitimacy of maths is undermined \n' +
    'what’s known as naturalized epistemology, according to which knowledge,\n' +
    'including metaphysical knowledge, must be compatible with our status as\n' +
    'natural creatures, and any inquiry into the nature of knowledge must be a\n' +
    'part of a more general natural scientific – hence, empirical – inquiry into\n' +
    'our cognitive capacities. Perhaps there is no room here for metaphysical\n' +
    'knowledge, for such knowledge is acquired via purportedly non-empirical\n' +
    'means, and it is perhaps the case that such knowledge is incompatible with\n' +
    'our status as natural creatures (how can natural creatures acquire\n' +
    'knowledge of such apparently unnatural entities as propositions and\n' +
    'sets?). Nevertheless, it is controversial whether naturalized epistemology\n' +
    'is correct. And, here again, this sort of controversy is a metaphysical one:\n' +
    'to have this sort of dispute is to have a dispute over the fundamental\n' +
    'nature of reality. We need not settle the dispute to see that we are doing\n' +
    'metaphysics as soon as we have the dispute.';
const EX =
    'I can keep my explanation short here. \n' +
    'However, I would still like to repeat some of the main points.\n' +
    'Now I want to move on to. \n' +
    'I want to explain a little bit about how cosmic rays \n' +
    'particles entering the atmosphere interact. \n' +
    'These interactions, this decay chain. \n' +
    'We had an introduction earlier, I can keep my explanation short here. \n' +
    'However, I would still like to repeat some of the main points.\n' +
    'Anyway, after two years from the beginning, we concluded that \n';

class MarkovText {
    constructor(input, stateSize) {
        this.cache = {};
        this.words = input.split(/\s/);
        this.startwords = [this.words[0]];
        this.stateSize = stateSize || 2;
        this.analyzed = false;
    }

    choose(arr) {
        return arr[~~(Math.random() * arr.length)]
    }

// get the next set of words as a string
    getNextSet(i) {
        return this.words.slice(i, i + this.stateSize).join(' ')
    }

// create a markov lookup
    analyze(input) {
        const len = this.words.length;
        let next;
        this.words.forEach((word, i) => {
            next = this.getNextSet(++i)
            ;(this.cache[word] = this.cache[word] || []).push(next)
            ;/[A-Z]/.test(word[0]) && this.startwords.push(word)
        });
        return this.analyzed = true && this;
    }

// generate new text from a markov lookup
    generate(outputSize) {
        //TODO better sentences
        let seed, arr, choice, curr, i = 1;
        !this.analyzed && this.analyze();
        arr = [seed = this.choose(this.startwords)];
        for (; i < outputSize; i += this.stateSize) {
            arr.push(choice = this.choose(curr || this.cache[seed]));
            curr = this.cache[choice.split(' ').pop()];
        }
        return arr.join(' ');
    }
}

