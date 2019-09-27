export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryAccountInfo: '/account',
  queryAccount: '/account/:id',
  queryAccountList: '/accounts',
  updateAccount: 'Patch /account/:id',
  createAccount: 'POST /account',
  removeAccount: 'DELETE /account/:id',
  removeAccountList: 'POST /accounts/delete',

  queryPackageInfo: '/package',
  queryPackage: '/package/:id',
  queryPackageList: '/packages',
  updatePackage: 'Patch /package/:id',
  createPackage: 'POST /package',
  removePackage: 'DELETE /package/:id',
  removePackageList: 'POST /packages/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
}
