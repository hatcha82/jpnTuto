import Translator from 'papago';

translator = new Translator(process.env.CLIENT_ID|'w7FsuKKmd0_0nh3h_yIb', process.env.CLIENT_SECRET | ONSQVwlB8B);
translator.translate('안녕하세요')
.then(result => {
  console.log(result.text); // Hello.
})
.catch(err => {
    console.log(err.code);
});