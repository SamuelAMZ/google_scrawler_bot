// get all dom text and return 3 array of sentences

const textsArr = (allText) => {
  // remove empty texts
  if (!allText) {
    return false;
  }

  //   1 word
  const realText = [];
  allText.forEach((elm) => {
    if (elm !== "") {
      realText.push(elm.replaceAll("\n", "").toLowerCase().trim());
    }
  });

  // create sentences of 2,3,4,5
  let sentenceOf1 = realText;
  let sentenceOf2 = [];
  let sentenceOf3 = [];

  //   2 words
  let track1 = 1;
  for (let i = 0; i < realText.length; i++) {
    sentenceOf2.push(realText[i] + " " + realText[track1]);
    track1++;
  }

  //   3 words
  let track2 = 1;
  let track3 = 2;
  for (let i = 0; i < realText.length; i++) {
    sentenceOf3.push(
      realText[i] + " " + realText[track2] + " " + realText[track3]
    );
    track2++;
    track3++;
  }

  return { sentenceOf1, sentenceOf2, sentenceOf3 };
};

module.exports = textsArr;
