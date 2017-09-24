import { StoretestPage } from './app.po';

describe('storetest App', () => {
  let page: StoretestPage;

  beforeEach(() => {
    page = new StoretestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
