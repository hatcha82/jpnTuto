const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var fs = require('fs');

const sourceText = 
`
週末の大通りを 黒猫が歩く
御自慢の鍵尻尾を水平に 威風堂々と
その姿から猫は 忌み嫌われていた
闇に溶ける その体目掛けて 石を投げられた

孤独には慣れていた 寧ろ望んでいた
誰かを思いやる事なんて 煩わしくて
そんな猫を抱き上げる 若い絵描きの腕
「今晩は 素敵なおチビさん 僕らよく似てる」

腕の中もがいて 必死で引っ掻いて 孤独という名の逃げ道を

走った 走った 生まれて初めての
優しさが 温もりが まだ信じられなくて

どれだけ逃げたって 変わり者は付いて来た

それから猫は絵描きと 二度目の冬を過ごす
絵描きは 友達に名前をやった 「黒き幸」ホーリーナイト
彼のスケッチブックは ほとんど黒尽くめ
黒猫も 初めての友達に くっついて甘えたが ある日

貧しい生活に 倒れる名付け親 最後の手紙を書くと 彼はこう言った

「走って 走って こいつを届けてくれ
夢を見て 飛び出した僕の 帰りを待つ恋人へ」

不吉な黒猫の絵など売れないが それでもアンタは俺だけ描いた
それ故 アンタは冷たくなった 手紙は確かに受け取った

雪の降る山道を 黒猫が走る
今は故き親友との約束を その口に銜えて
「見ろよ、悪魔の使者だ!」 石を投げる子供
何とでも呼ぶがいいさ 俺には 消えない名前があるから
「ホーリーナイト」「聖なる夜」と 呼んでくれた
優しさも温もりも 全て詰め込んで 呼んでくれた
忌み嫌われた俺にも 意味があるとするならば
この日のタメに生まれて来たんだろう どこまでも走るよ

彼は辿り着いた 親友の故郷に 恋人の家まで あと数キロだ

走った 転んだ すでに満身創痍だ
立ち上がる間もなく 襲い来る 罵声と暴力
負けるか俺はホーリーナイト 千切れそうな手足を
引き摺り なお走った 見つけた! この家だ!

手紙を読んだ恋人は もう動かない猫の名に
アルファベット1つ 加えて庭に埋めてやった
聖なる騎士を埋めてやった
`;

(async () => {

  try {
    // await furiganaLyrics()   
    await papagoTranslate(sourceText)
    setInterval( async() => {
      await papagoTranslate(sourceText)
    },1000 * 60)
    
  } catch (error) {
    console.log(`Error : ${error}` )
  }
})();
async function papagoTranslate(sourceText){
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://papago.naver.com');

  const param = {
    selector : '#txtSource',
    sourceText : sourceText
  }

  await page.evaluate(param => {
      document.querySelector(param.selector).value = param.sourceText
  }, param);
  await page.type(param.selector,'\n', {delay: 1000});
  await page.click("#btnTranslate");

  page.on('response', response => {
    var url = response.url()
    if(url === 'https://papago.naver.com/apis/n2mt/translate'){
      response.text().then( async function (textBody) {
        JSONObj = JSON.parse(textBody)
        console.log(JSONObj.translatedText);
        //fs.writeFile('myjsonfile.text', textBody); 
        setTimeout(async ()=>{
          browser.close()
        },1000 * 10)
      })
    }
  })
}
async function furiganaLyrics(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(devices['iPhone 6']);
  await page.goto('http://www.furiganahub.com/music/detail/700');
  const resultsSelector = '#undefined > div > div > div';
  await page.waitForSelector(resultsSelector);
  const lyrics = await page.evaluate(resultsSelector => {
    const elems = Array.from(document.querySelectorAll(resultsSelector));
    return elems.map(elem => {
      const title = elem.textContent;
      return `${title}`;
    });
  }, resultsSelector);
  console.log(lyrics[0]);

  // await page.screenshot({path: 'full.png', fullPage: true});
  await browser.close();
}
