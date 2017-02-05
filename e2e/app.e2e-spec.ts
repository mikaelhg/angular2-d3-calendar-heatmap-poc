import { D3v4CalPage } from './app.po';

describe('d3v4-cal App', function() {
  let page: D3v4CalPage;

  beforeEach(() => {
    page = new D3v4CalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
