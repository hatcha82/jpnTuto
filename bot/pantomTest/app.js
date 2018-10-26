const phantom = require('phantom');

(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open('https://papago.naver.com/?sk=auto&tk=ja&st=%ED%95%9C%EA%B5%AD%EC%96%B4%20%EB%B0%9C%EC%9D%8C');
  const content = await page.property('content');
  console.log(content);

  await instance.exit();
})();