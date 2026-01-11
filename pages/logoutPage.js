export default class LogoutPage{
constructor(page){
  this.page = page;
  this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
  this.profileButton = page.getByRole('button', { name: 'Profile' });
}

async goOut(){
  await this.profileButton.click();
  await this.logoutButton.click();
}
}

