import { AngularMaterialFacePage } from './app.po';

describe('angular-material-face App', function() {
  let page: AngularMaterialFacePage;

  beforeEach(() => {
    page = new AngularMaterialFacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
