Handlebars.registerHelper('renderImportance', (importance) => {
    let result = '';
    for (let i = 1; i <= 5; i++) {
      let on = importance >= i ? 'on' : 'off';
      result += `<img src="assets/img/flash-${on}.png" class="img-flash" />`;
    }
    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('isFinished', function (finished) {
  return finished == 'true';
});
